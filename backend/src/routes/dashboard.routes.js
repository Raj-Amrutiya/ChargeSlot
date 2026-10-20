const express = require('express');
const router = express.Router();
const { getCustomerDashboard } = require('../controllers/booking.controller');
const authenticate = require('../middleware/authenticate');

router.get('/customer', authenticate, getCustomerDashboard);

module.exports = router;
