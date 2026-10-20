const Station = require('../models/Station');
const Connector = require('../models/Connector');
const Booking = require('../models/Booking');
const { getStationAvailability } = require('../services/booking.service');

/**
 * @desc    Get all stations with optional search & filters
 * @route   GET /api/stations
 * @access  Public
 */
const getStations = async (req, res, next) => {
  try {
    const { search, city, status, connectorType, maxPrice, page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by active status for public, unless specified
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (maxPrice) {
      query.pricePerKwh = { $lte: Number(maxPrice) };
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { address: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    // Connector type filter
    if (connectorType) {
      const matchingConnectors = await Connector.find({ type: connectorType }).select('stationId');
      const stationIds = matchingConnectors.map((c) => c.stationId);
      query._id = { $in: stationIds };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [stations, total] = await Promise.all([
      Station.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Station.countDocuments(query),
    ]);

    // Attach connector summary for each station
    const stationIds = stations.map((s) => s._id);
    const allConnectors = await Connector.find({ stationId: { $in: stationIds } });

    const enrichedStations = stations.map((station) => {
      const stationConnectors = allConnectors.filter(
        (c) => c.stationId.toString() === station._id.toString()
      );
      const totalConnectors = stationConnectors.length;
      const availableConnectors = stationConnectors.filter((c) => c.status === 'available').length;
      const connectorTypes = [...new Set(stationConnectors.map((c) => c.type))];
      const maxPower = stationConnectors.reduce((max, c) => Math.max(max, c.powerKw || 0), 0);

      return {
        ...station.toObject(),
        totalConnectors,
        availableConnectors,
        connectorTypes,
        maxPowerKw: maxPower,
      };
    });

    return res.status(200).json({
      success: true,
      data: enrichedStations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single station by ID with full details & connectors
 * @route   GET /api/stations/:id
 * @access  Public
 */
const getStationById = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Charging station not found',
      });
    }

    const connectors = await Connector.find({ stationId: station._id }).sort({ label: 1 });

    return res.status(200).json({
      success: true,
      data: {
        ...station.toObject(),
        connectors,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get availability slots for a station on a given date
 * @route   GET /api/stations/:id/availability
 * @access  Public
 */
const getStationSlots = async (req, res, next) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    const availability = await getStationAvailability(req.params.id, date);

    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new station (Admin only)
 * @route   POST /api/stations
 * @access  Private/Admin
 */
const createStation = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      city,
      postalCode,
      latitude,
      longitude,
      imageUrl,
      openingTime,
      closingTime,
      pricePerKwh,
      amenities,
      status,
    } = req.body;

    const station = await Station.create({
      name,
      description,
      address,
      city,
      postalCode,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      imageUrl,
      openingTime,
      closingTime,
      pricePerKwh,
      amenities,
      status: status || 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Charging station created successfully',
      data: station,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing station (Admin only)
 * @route   PATCH /api/stations/:id
 * @access  Private/Admin
 */
const updateStation = async (req, res, next) => {
  try {
    const { latitude, longitude, ...rest } = req.body;
    const updateData = { ...rest };

    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    const station = await Station.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Charging station not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Charging station updated successfully',
      data: station,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Archive / Delete station (Admin only)
 * @route   DELETE /api/stations/:id
 * @access  Private/Admin
 */
const deleteStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Charging station not found',
      });
    }

    const bookingCount = await Booking.countDocuments({ stationId: station._id });

    // Safe archival approach if historical bookings exist
    if (bookingCount > 0) {
      station.status = 'inactive';
      await station.save();

      return res.status(200).json({
        success: true,
        message: 'Station has associated historical bookings and has been archived (set to inactive).',
        data: station,
      });
    }

    // Permanently remove if no bookings exist
    await Connector.deleteMany({ stationId: station._id });
    await station.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Station and its connectors deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStations,
  getStationById,
  getStationSlots,
  createStation,
  updateStation,
  deleteStation,
};
