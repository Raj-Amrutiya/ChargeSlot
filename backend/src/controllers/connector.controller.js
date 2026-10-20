const Connector = require('../models/Connector');
const Booking = require('../models/Booking');

/**
 * @desc    Get all connectors with optional stationId filter
 * @route   GET /api/connectors
 * @access  Public
 */
const getConnectors = async (req, res, next) => {
  try {
    const { stationId, status } = req.query;
    const filter = {};

    if (stationId) filter.stationId = stationId;
    if (status) filter.status = status;

    const connectors = await Connector.find(filter)
      .populate('stationId', 'name city status')
      .sort({ label: 1 });

    return res.status(200).json({
      success: true,
      data: connectors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new connector (Admin only)
 * @route   POST /api/connectors
 * @access  Private/Admin
 */
const createConnector = async (req, res, next) => {
  try {
    const { stationId, label, type, powerKw, status } = req.body;

    const existing = await Connector.findOne({ stationId, label });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Connector with label '${label}' already exists at this station`,
      });
    }

    const connector = await Connector.create({
      stationId,
      label,
      type,
      powerKw,
      status: status || 'available',
    });

    const populated = await Connector.findById(connector._id).populate('stationId', 'name city');

    return res.status(201).json({
      success: true,
      message: 'Connector created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update connector (Admin only)
 * @route   PATCH /api/connectors/:id
 * @access  Private/Admin
 */
const updateConnector = async (req, res, next) => {
  try {
    const connector = await Connector.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('stationId', 'name city');

    if (!connector) {
      return res.status(404).json({
        success: false,
        message: 'Connector not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Connector updated successfully',
      data: connector,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete or deactivate connector (Admin only)
 * @route   DELETE /api/connectors/:id
 * @access  Private/Admin
 */
const deleteConnector = async (req, res, next) => {
  try {
    const connector = await Connector.findById(req.params.id);
    if (!connector) {
      return res.status(404).json({
        success: false,
        message: 'Connector not found',
      });
    }

    const bookingCount = await Booking.countDocuments({ connectorId: connector._id });

    if (bookingCount > 0) {
      connector.status = 'offline';
      await connector.save();

      return res.status(200).json({
        success: true,
        message: 'Connector has historical bookings and was deactivated (offline).',
        data: connector,
      });
    }

    await connector.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Connector deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConnectors,
  createConnector,
  updateConnector,
  deleteConnector,
};
