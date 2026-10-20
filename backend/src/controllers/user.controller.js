const User = require('../models/User');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

/**
 * @desc    Get user profile with summary stats
 * @route   GET /api/users/me
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    const totalBookings = await Booking.countDocuments({ userId: req.user._id });
    const upcomingBookings = await Booking.countDocuments({
      userId: req.user._id,
      status: 'confirmed',
      startTime: { $gte: new Date() },
    });

    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          totalBookings,
          upcomingBookings,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, preferredVehicle, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (preferredVehicle) {
      user.preferredVehicle = {
        model: preferredVehicle.model ?? user.preferredVehicle?.model ?? '',
        regNumber: preferredVehicle.regNumber ?? user.preferredVehicle?.regNumber ?? '',
      };
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password',
        });
      }

      user.passwordHash = newPassword;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user notifications
 * @route   GET /api/users/notifications
 * @access  Private
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/users/notifications/:id/read
 * @access  Private
 */
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead,
};
