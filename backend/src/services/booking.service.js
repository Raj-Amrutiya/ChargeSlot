const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Connector = require('../models/Connector');
const Station = require('../models/Station');
const Notification = require('../models/Notification');
const { generateBookingCode } = require('../utils/generateCode');

/**
 * Check if an overlapping confirmed booking exists for the given connector
 * Overlap condition:
 * existing.startTime < requested.endTime AND existing.endTime > requested.startTime
 */
const hasOverlappingBooking = async (connectorId, startTime, endTime, excludeBookingId = null) => {
  const query = {
    connectorId,
    status: 'confirmed',
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existing = await Booking.findOne(query);
  return !!existing;
};

/**
 * Calculate available slots for a station on a given date (YYYY-MM-DD)
 */
const getStationAvailability = async (stationId, dateString) => {
  const station = await Station.findById(stationId);
  if (!station) {
    throw new Error('Station not found');
  }

  const connectors = await Connector.find({
    stationId,
    status: { $ne: 'offline' },
  });

  if (connectors.length === 0) {
    return {
      date: dateString,
      station: { id: station._id, name: station.name },
      slots: [],
    };
  }

  // Parse start and end of day in UTC / local representation
  const targetDate = dateString ? new Date(dateString) : new Date();
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();

  const [openHour] = station.openingTime.split(':').map(Number);
  const [closeHour] = station.closingTime.split(':').map(Number);

  // Fetch all confirmed bookings for this station on this day
  const dayStart = new Date(year, month, day, 0, 0, 0);
  const dayEnd = new Date(year, month, day, 23, 59, 59);

  const activeBookings = await Booking.find({
    stationId,
    status: 'confirmed',
    startTime: { $lt: dayEnd },
    endTime: { $gt: dayStart },
  });

  const slots = [];

  for (let hour = openHour; hour < closeHour; hour++) {
    const slotStart = new Date(year, month, day, hour, 0, 0);
    const slotEnd = new Date(year, month, day, hour + 1, 0, 0);

    const availableConnectors = [];
    const bookedConnectors = [];

    for (const connector of connectors) {
      if (connector.status === 'maintenance') {
        continue;
      }

      // Check if this connector has a conflicting booking
      const isBooked = activeBookings.some((b) => {
        return (
          b.connectorId.toString() === connector._id.toString() &&
          new Date(b.startTime) < slotEnd &&
          new Date(b.endTime) > slotStart
        );
      });

      if (isBooked) {
        bookedConnectors.push(connector);
      } else {
        availableConnectors.push(connector);
      }
    }

    slots.push({
      slotLabel: `${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:00`,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      totalConnectors: connectors.length,
      availableCount: availableConnectors.length,
      isAvailable: availableConnectors.length > 0,
      availableConnectors: availableConnectors.map((c) => ({
        _id: c._id,
        label: c.label,
        type: c.type,
        powerKw: c.powerKw,
      })),
    });
  }

  return {
    date: dateString,
    station: {
      id: station._id,
      name: station.name,
      openingTime: station.openingTime,
      closingTime: station.closingTime,
    },
    slots,
  };
};

/**
 * Atomically create a booking with double-check lock to prevent race conditions
 */
const createBooking = async ({ userId, stationId, connectorId, startTime, endTime, notes, vehicleInfo }) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    const err = new Error('End time must be strictly after start time');
    err.statusCode = 400;
    throw err;
  }

  if (start < new Date(Date.now() - 5 * 60 * 1000)) {
    const err = new Error('Cannot book a slot in the past');
    err.statusCode = 400;
    throw err;
  }

  const station = await Station.findById(stationId);
  if (!station || station.status !== 'active') {
    const err = new Error('Station is not available for booking');
    err.statusCode = 404;
    throw err;
  }

  const connector = await Connector.findOne({ _id: connectorId, stationId });
  if (!connector || connector.status === 'offline') {
    const err = new Error('Selected connector is offline or not found at this station');
    err.statusCode = 404;
    throw err;
  }

  if (connector.status === 'maintenance') {
    const err = new Error('Selected connector is currently under maintenance');
    err.statusCode = 400;
    throw err;
  }

  // Check overlap
  const isOverlap = await hasOverlappingBooking(connectorId, start, end);
  if (isOverlap) {
    const err = new Error('Selected slot is no longer available. Please choose another time or connector.');
    err.statusCode = 409;
    throw err;
  }

  // Calculate estimated cost:
  // Duration in hours * estimated average power delivered (kW) * pricePerKwh
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const assumedDrawRate = Math.min(connector.powerKw, 50); // Typical vehicle AC/DC draw average
  const estimatedKwh = Math.round(durationHours * assumedDrawRate * 10) / 10;
  const estimatedCost = Math.round(estimatedKwh * station.pricePerKwh);

  const bookingCode = generateBookingCode();

  const booking = await Booking.create({
    bookingCode,
    userId,
    stationId,
    connectorId,
    startTime: start,
    endTime: end,
    status: 'confirmed',
    estimatedCost,
    notes,
    vehicleInfo,
  });

  // Create persistent notification for user
  await Notification.create({
    userId,
    title: 'Booking Confirmed ⚡',
    message: `Your slot at ${station.name} (${connector.label}) is confirmed for ${start.toLocaleDateString()} at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Reference: ${bookingCode}`,
    type: 'success',
  });

  const populated = await Booking.findById(booking._id)
    .populate('stationId', 'name address city pricePerKwh imageUrl')
    .populate('connectorId', 'label type powerKw')
    .populate('userId', 'name email phone');

  return populated;
};

/**
 * Cancel an existing reservation
 */
const cancelBooking = async (bookingId, userId, isAdmin = false) => {
  const booking = await Booking.findById(bookingId)
    .populate('stationId', 'name')
    .populate('connectorId', 'label');

  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  if (!isAdmin && booking.userId.toString() !== userId.toString()) {
    const err = new Error('You are not authorized to cancel this reservation');
    err.statusCode = 403;
    throw err;
  }

  if (booking.status === 'cancelled') {
    const err = new Error('This booking is already cancelled');
    err.statusCode = 400;
    throw err;
  }

  if (booking.status === 'completed') {
    const err = new Error('Completed reservations cannot be cancelled');
    err.statusCode = 400;
    throw err;
  }

  booking.status = 'cancelled';
  await booking.save();

  // Create cancellation notification
  await Notification.create({
    userId: booking.userId,
    title: 'Booking Cancelled',
    message: `Your booking ${booking.bookingCode} at ${booking.stationId?.name || 'station'} has been cancelled. The time slot is now released.`,
    type: 'warning',
  });

  return booking;
};

module.exports = {
  hasOverlappingBooking,
  getStationAvailability,
  createBooking,
  cancelBooking,
};
