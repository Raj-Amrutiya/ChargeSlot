const crypto = require('crypto');

/**
 * Generate human-readable booking code e.g. CS-2026-X8K9
 */
const generateBookingCode = () => {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CS-${year}-${randomPart}`;
};

module.exports = {
  generateBookingCode,
};
