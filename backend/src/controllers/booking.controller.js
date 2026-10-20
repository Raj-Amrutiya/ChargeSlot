const Booking = require('../models/Booking');
const Station = require('../models/Station');
const bookingService = require('../services/booking.service');

/**
 * @desc    Create a new charging slot booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res, next) => {
  try {
    const { stationId, connectorId, startTime, endTime, notes, vehicleInfo } = req.body;

    const booking = await bookingService.createBooking({
      userId: req.user._id,
      stationId,
      connectorId,
      startTime,
      endTime,
      notes,
      vehicleInfo: vehicleInfo || req.user.preferredVehicle,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for logged-in user
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('stationId', 'name address city pricePerKwh imageUrl')
        .populate('connectorId', 'label type powerKw')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: bookings,
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
 * @desc    Get booking details by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('stationId', 'name description address city postalCode pricePerKwh imageUrl openingTime closingTime')
      .populate('connectorId', 'label type powerKw status')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found',
      });
    }

    // Access control: only owner or admin can view
    if (req.user.role !== 'admin' && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this booking',
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id, isAdmin);

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. The slot is now released.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get customer dashboard metrics
 * @route   GET /api/dashboard/customer
 * @access  Private
 */
const getCustomerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [totalBookings, upcomingCount, completedCount, cancelledCount, upcomingBooking, recentBookings, nearbyStations] =
      await Promise.all([
        Booking.countDocuments({ userId }),
        Booking.countDocuments({ userId, status: 'confirmed', startTime: { $gte: now } }),
        Booking.countDocuments({ userId, status: 'completed' }),
        Booking.countDocuments({ userId, status: 'cancelled' }),
        Booking.findOne({ userId, status: 'confirmed', startTime: { $gte: now } })
          .populate('stationId', 'name address city pricePerKwh imageUrl')
          .populate('connectorId', 'label type powerKw')
          .sort({ startTime: 1 }),
        Booking.find({ userId })
          .populate('stationId', 'name address city')
          .populate('connectorId', 'label type powerKw')
          .sort({ createdAt: -1 })
          .limit(5),
        Station.find({ status: 'active' }).limit(3),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBookings,
          upcomingBookings: upcomingCount,
          completedSessions: completedCount,
          cancelledBookings: cancelledCount,
        },
        upcomingBooking,
        recentBookings,
        nearbyStations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getCustomerDashboard,
};
