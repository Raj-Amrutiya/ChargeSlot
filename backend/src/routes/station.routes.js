const express = require('express');
const router = express.Router();
const {
  getStations,
  getStationById,
  getStationSlots,
  createStation,
  updateStation,
  deleteStation,
} = require('../controllers/station.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { stationSchema } = require('../validators');

// Public routes
router.get('/', getStations);
router.get('/:id', getStationById);
router.get('/:id/availability', getStationSlots);

// Admin-only CRUD
router.post('/', authenticate, authorize('admin'), validate(stationSchema), createStation);
router.patch('/:id', authenticate, authorize('admin'), updateStation);
router.delete('/:id', authenticate, authorize('admin'), deleteStation);

module.exports = router;
