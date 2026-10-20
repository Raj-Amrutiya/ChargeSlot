const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getCustomerDashboard,
} = require('../controllers/booking.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { bookingSchema } = require('../validators');

router.use(authenticate);

router.post('/', validate(bookingSchema), createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
