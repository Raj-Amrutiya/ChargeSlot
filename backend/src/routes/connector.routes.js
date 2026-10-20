const express = require('express');
const router = express.Router();
const {
  getConnectors,
  createConnector,
  updateConnector,
  deleteConnector,
} = require('../controllers/connector.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { connectorSchema } = require('../validators');

router.get('/', getConnectors);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), validate(connectorSchema), createConnector);
router.patch('/:id', authenticate, authorize('admin'), updateConnector);
router.delete('/:id', authenticate, authorize('admin'), deleteConnector);

module.exports = router;
