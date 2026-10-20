const http = require('http');
const app = require('../src/app');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

async function runTests() {
  console.log('⚡ Starting ChargeSlot API automated test runner...');
  await connectDB();

  const server = app.listen(5099);
  const baseUrl = 'http://127.0.0.1:5099/api';

  const request = async (path, options = {}) => {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  try {
    // 1. Health check
    console.log('Test 1: Health check endpoint');
    const health = await request('/health');
    if (health.status !== 200 || health.data.status !== 'ok') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('  ✓ Health check passed');

    // 2. Login as Customer
    console.log('Test 2: Customer authentication');
    const customerLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'raj@chargeslot.com', password: 'Customer@123' }),
    });
    if (customerLogin.status !== 200 || !customerLogin.data.token) {
      throw new Error(`Customer login failed: ${JSON.stringify(customerLogin)}`);
    }
    const customerToken = customerLogin.data.token;
    console.log('  ✓ Customer login successful');

    // 3. Login as Admin
    console.log('Test 3: Admin authentication');
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@chargeslot.com', password: 'Admin@123' }),
    });
    if (adminLogin.status !== 200 || adminLogin.data.data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLogin)}`);
    }
    const adminToken = adminLogin.data.token;
    console.log('  ✓ Admin login successful with role: admin');

    // 4. Role Authorization: Customer attempting Admin endpoint
    console.log('Test 4: RBAC Security enforcement');
    const forbiddenAttempt = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (forbiddenAttempt.status !== 403) {
      throw new Error(`Expected 403 Forbidden for customer on admin route, got ${forbiddenAttempt.status}`);
    }
    console.log('  ✓ Protected admin route properly returned 403 for customer');

    // 5. Fetch stations
    console.log('Test 5: Station listing and connector aggregation');
    const stationsRes = await request('/stations');
    if (stationsRes.status !== 200 || stationsRes.data.data.length === 0) {
      throw new Error(`Failed to list stations: ${JSON.stringify(stationsRes)}`);
    }
    const sampleStation = stationsRes.data.data[0];
    console.log(`  ✓ Found ${stationsRes.data.data.length} stations. Sample: "${sampleStation.name}" with ${sampleStation.totalConnectors} connectors`);

    // 6. Station availability
    console.log('Test 6: Slot availability calculation');
    const availRes = await request(`/stations/${sampleStation._id}/availability?date=2026-10-25`);
    if (availRes.status !== 200 || !Array.isArray(availRes.data.data.slots)) {
      throw new Error(`Availability fetch failed: ${JSON.stringify(availRes)}`);
    }
    console.log(`  ✓ Availability generated ${availRes.data.data.slots.length} time slots`);

    // 7. Booking creation and Overlap Prevention
    console.log('Test 7: Booking creation and Overlap Prevention');
    const connectorsRes = await request(`/connectors?stationId=${sampleStation._id}`);
    const targetConnector = connectorsRes.data.data[0];

    const slotStart = new Date(Date.now() + 86400000 * 5); // 5 days in future
    slotStart.setHours(14, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(15, 0, 0, 0);

    // Initial booking
    const booking1 = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        stationId: sampleStation._id,
        connectorId: targetConnector._id,
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        notes: 'API Automated Test Booking',
      }),
    });
    if (booking1.status !== 201) {
      throw new Error(`Failed to create test booking: ${JSON.stringify(booking1)}`);
    }
    const createdBookingId = booking1.data.data._id;
    console.log(`  ✓ Booking 1 created: ${booking1.data.data.bookingCode}`);

    // Overlapping booking attempt (should be rejected with 409 Conflict)
    const overlapStart = new Date(slotStart);
    overlapStart.setMinutes(30); // 14:30 to 15:30 (overlaps with 14:00 - 15:00)
    const overlapEnd = new Date(slotEnd);
    overlapEnd.setMinutes(30);

    const overlapAttempt = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        stationId: sampleStation._id,
        connectorId: targetConnector._id,
        startTime: overlapStart.toISOString(),
        endTime: overlapEnd.toISOString(),
        notes: 'Conflict test booking',
      }),
    });
    if (overlapAttempt.status !== 409) {
      throw new Error(`Expected 409 Conflict for overlapping booking, got ${overlapAttempt.status}`);
    }
    console.log('  ✓ Overlapping booking was rejected with HTTP 409 Conflict!');

    // 8. Cancellation releases the slot
    console.log('Test 8: Booking cancellation');
    const cancelRes = await request(`/bookings/${createdBookingId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (cancelRes.status !== 200 || cancelRes.data.data.status !== 'cancelled') {
      throw new Error(`Cancellation failed: ${JSON.stringify(cancelRes)}`);
    }
    console.log('  ✓ Booking cancelled successfully. Slot is released.');

    // 9. Now the previously overlapping slot should succeed
    const rebookAttempt = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        stationId: sampleStation._id,
        connectorId: targetConnector._id,
        startTime: overlapStart.toISOString(),
        endTime: overlapEnd.toISOString(),
        notes: 'Rebooking after slot released',
      }),
    });
    if (rebookAttempt.status !== 201) {
      throw new Error(`Expected booking to succeed after cancellation, got ${rebookAttempt.status}`);
    }
    console.log('  ✓ Successfully booked slot after previous reservation was cancelled!');

    console.log('\n==============================================');
    console.log('⚡ ALL 8 API AND BUSINESS LOGIC TESTS PASSED!');
    console.log('==============================================');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
