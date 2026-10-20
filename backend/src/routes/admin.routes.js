const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminAnalytics,
  getAllBookings,
  getAllUsers,
  updateUserStatus,
} = require('../controllers/admin.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getAdminAnalytics);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);

module.exports = router;
