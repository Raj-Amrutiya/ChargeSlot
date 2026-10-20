const Station = require('../models/Station');
const Connector = require('../models/Connector');
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * @desc    Get Admin Dashboard top metrics and recent activity
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalStations,
      activeStations,
      totalConnectors,
      activeConnectors,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalUsers,
      recentBookings,
    ] = await Promise.all([
      Station.countDocuments(),
      Station.countDocuments({ status: 'active' }),
      Connector.countDocuments(),
      Connector.countDocuments({ status: 'available' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'customer' }),
      Booking.find()
        .populate('stationId', 'name city')
        .populate('connectorId', 'label type powerKw')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    // Calculate total estimated booking value
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$estimatedCost' } } },
    ]);
    const estimatedTotalValue = revenueAgg[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalStations,
          activeStations,
          totalConnectors,
          activeConnectors,
          totalBookings,
          confirmedBookings,
          cancelledBookings,
          totalUsers,
          estimatedTotalValue,
        },
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed Admin analytics for charts
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Status distribution
    const statusDist = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 2. Bookings by station
    const stationPopularity = await Booking.aggregate([
      { $group: { _id: '$stationId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'stations',
          localField: '_id',
          foreignField: '_id',
          as: 'station',
        },
      },
      { $unwind: '$station' },
      {
        $project: {
          stationId: '$_id',
          stationName: '$station.name',
          city: '$station.city',
          bookings: '$count',
        },
      },
    ]);

    // 3. Last 7 days booking trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendAgg = await Booking.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          estimatedValue: { $sum: '$estimatedCost' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days so the chart always has 7 continuous data points
    const trend = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const match = trendAgg.find((item) => item._id === key);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      trend.push({
        date: key,
        day: dayLabel,
        bookings: match ? match.count : 0,
        estimatedValue: match ? match.estimatedValue : 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        statusDistribution: statusDist.map((item) => ({ name: item._id, value: item.count })),
        stationPopularity,
        dailyTrends: trend,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings across the platform with filtering & pagination
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
const getAllBookings = async (req, res, next) => {
  try {
    const { search, status, stationId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (stationId) {
      query.stationId = stationId;
    }

    if (search) {
      query.bookingCode = new RegExp(search, 'i');
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('stationId', 'name address city')
        .populate('connectorId', 'label type powerKw')
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
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
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;

    if (search) {
      query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
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
 * @desc    Update user status / role (Admin only)
 * @route   PATCH /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { status, role } = req.body;
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Safety: Admin cannot deactivate or demote their own account
    if (userToUpdate._id.toString() === req.user._id.toString()) {
      if (status === 'inactive' || (role && role !== 'admin')) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate or demote your own administrator account',
        });
      }
    }

    if (status) userToUpdate.status = status;
    if (role) userToUpdate.role = role;

    await userToUpdate.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminAnalytics,
  getAllBookings,
  getAllUsers,
  updateUserStatus,
};
