require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Station = require('./models/Station');
const Connector = require('./models/Connector');
const Booking = require('./models/Booking');
const Notification = require('./models/Notification');
const { generateBookingCode } = require('./utils/generateCode');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chargeslot';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Station.deleteMany({}),
      Connector.deleteMany({}),
      Booking.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('Seeding Users...');
    // Create Admin and Customer accounts
    const admin = await User.create({
      name: 'ChargeSlot Admin',
      email: 'admin@chargeslot.com',
      passwordHash: 'Admin@123',
      phone: '+91 98765 43210',
      role: 'admin',
      status: 'active',
      preferredVehicle: {
        model: 'Tesla Model 3',
        regNumber: 'GJ-01-CS-0001',
      },
    });

    const customerRaj = await User.create({
      name: 'Raj Amrutiya',
      email: 'raj@chargeslot.com',
      passwordHash: 'Customer@123',
      phone: '+91 98250 12345',
      role: 'customer',
      status: 'active',
      preferredVehicle: {
        model: 'Tata Nexon EV Max',
        regNumber: 'GJ-01-EV-2026',
      },
    });

    const customerPriya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@chargeslot.com',
      passwordHash: 'Customer@123',
      phone: '+91 98980 67890',
      role: 'customer',
      status: 'active',
      preferredVehicle: {
        model: 'MG ZS EV Long Range',
        regNumber: 'GJ-27-EV-1008',
      },
    });

    console.log('Seeding Charging Stations...');
    const stations = await Station.create([
      {
        name: 'Central EV Charging Hub',
        description: 'Ultra-fast public charging hub near AlphaOne Mall with 24/7 dedicated lounge and café.',
        address: 'Opposite Vastrapur Lake, Vastrapur',
        city: 'Ahmedabad',
        postalCode: '380015',
        location: {
          type: 'Point',
          coordinates: [72.5293, 23.0373], // [lng, lat]
        },
        imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
        openingTime: '06:00',
        closingTime: '23:00',
        pricePerKwh: 18,
        amenities: ['Café', 'Restroom', 'Covered Parking', 'High-Speed Wi-Fi', 'Security Guard'],
        status: 'active',
      },
      {
        name: 'SG Highway Supercharge Plaza',
        description: 'High-power 120kW DC fast chargers situated right along the main corridor of SG Highway.',
        address: 'Near ISKCON Cross Roads, SG Highway, Bodakdev',
        city: 'Ahmedabad',
        postalCode: '380054',
        location: {
          type: 'Point',
          coordinates: [72.5085, 23.0289],
        },
        imageUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=1200&q=80',
        openingTime: '00:00',
        closingTime: '23:59',
        pricePerKwh: 22,
        amenities: ['24/7 Dining', 'Restroom', 'Tyre Air Station', 'EV Lounge'],
        status: 'active',
      },
      {
        name: 'GIFT City EcoCharge Park',
        description: 'Zero-carbon solar assisted EV charging terminal inside Gujarat International Finance Tec-City.',
        address: 'Tower B Boulevard, GIFT City',
        city: 'Gandhinagar',
        postalCode: '382355',
        location: {
          type: 'Point',
          coordinates: [72.6841, 23.161],
        },
        imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        openingTime: '07:00',
        closingTime: '22:00',
        pricePerKwh: 16,
        amenities: ['Solar Canopy', 'Café', 'Restroom', 'Digital Payment Kiosk'],
        status: 'active',
      },
      {
        name: 'Airport Express EV Terminal',
        description: 'Convenient charging terminal located right by Sardar Vallabhbhai Patel International Airport.',
        address: 'Airport Road, Hansol',
        city: 'Ahmedabad',
        postalCode: '382475',
        location: {
          type: 'Point',
          coordinates: [72.6347, 23.0734],
        },
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        openingTime: '05:00',
        closingTime: '23:30',
        pricePerKwh: 20,
        amenities: ['Flight Information Screen', 'Valet Help', 'Coffee Shop', 'Waiting Area'],
        status: 'active',
      },
      {
        name: 'Infocity Green Mobility Port',
        description: 'Tech park charging destination offering multiple AC and DC dual-gun chargers.',
        address: 'Infocity Gate 3, Sector 0',
        city: 'Gandhinagar',
        postalCode: '382007',
        location: {
          type: 'Point',
          coordinates: [72.6369, 23.1956],
        },
        imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80',
        openingTime: '06:00',
        closingTime: '23:00',
        pricePerKwh: 17,
        amenities: ['Food Court', 'Restroom', 'Wi-Fi', 'Security'],
        status: 'active',
      },
    ]);

    console.log('Seeding Connectors...');
    const connectors = [];

    // Station 1: Central EV Hub
    connectors.push(
      await Connector.create({
        stationId: stations[0]._id,
        label: 'CCS2-01',
        type: 'CCS2',
        powerKw: 60,
        status: 'available',
      }),
      await Connector.create({
        stationId: stations[0]._id,
        label: 'CCS2-02',
        type: 'CCS2',
        powerKw: 120,
        status: 'available',
      }),
      await Connector.create({
        stationId: stations[0]._id,
        label: 'TYPE2-01',
        type: 'Type 2',
        powerKw: 22,
        status: 'available',
      })
    );

    // Station 2: SG Highway
    connectors.push(
      await Connector.create({
        stationId: stations[1]._id,
        label: 'CCS2-A',
        type: 'CCS2',
        powerKw: 120,
        status: 'available',
      }),
      await Connector.create({
        stationId: stations[1]._id,
        label: 'CHA-01',
        type: 'CHAdeMO',
        powerKw: 50,
        status: 'available',
      })
    );

    // Station 3: GIFT City
    connectors.push(
      await Connector.create({
        stationId: stations[2]._id,
        label: 'CCS2-01',
        type: 'CCS2',
        powerKw: 60,
        status: 'available',
      }),
      await Connector.create({
        stationId: stations[2]._id,
        label: 'TYPE2-01',
        type: 'Type 2',
        powerKw: 22,
        status: 'available',
      })
    );

    // Station 4: Airport Express
    connectors.push(
      await Connector.create({
        stationId: stations[3]._id,
        label: 'CCS2-Fast-1',
        type: 'CCS2',
        powerKw: 60,
        status: 'available',
      }),
      await Connector.create({
        stationId: stations[3]._id,
        label: 'CCS2-Fast-2',
        type: 'CCS2',
        powerKw: 120,
        status: 'available',
      })
    );

    // Station 5: Infocity
    connectors.push(
      await Connector.create({
        stationId: stations[4]._id,
        label: 'TYPE2-01',
        type: 'Type 2',
        powerKw: 22,
        status: 'available',
      }),
      await Connector.create({
        stationId: stations[4]._id,
        label: 'CCS2-01',
        type: 'CCS2',
        powerKw: 60,
        status: 'available',
      })
    );

    console.log('Seeding Sample Bookings...');
    const now = new Date();

    // Upcoming booking for Raj tomorrow 10:00 - 11:00 AM
    const tomorrow10 = new Date(now);
    tomorrow10.setDate(tomorrow10.getDate() + 1);
    tomorrow10.setHours(10, 0, 0, 0);

    const tomorrow11 = new Date(tomorrow10);
    tomorrow11.setHours(11, 0, 0, 0);

    await Booking.create({
      bookingCode: generateBookingCode(),
      userId: customerRaj._id,
      stationId: stations[0]._id,
      connectorId: connectors[0]._id, // Central Hub CCS2-01
      startTime: tomorrow10,
      endTime: tomorrow11,
      status: 'confirmed',
      estimatedCost: 288,
      notes: 'Morning top-up before highway commute',
      vehicleInfo: customerRaj.preferredVehicle,
    });

    // Completed past booking for Raj 2 days ago
    const pastStart = new Date(now);
    pastStart.setDate(pastStart.getDate() - 2);
    pastStart.setHours(14, 0, 0, 0);

    const pastEnd = new Date(pastStart);
    pastEnd.setHours(15, 0, 0, 0);

    await Booking.create({
      bookingCode: generateBookingCode(),
      userId: customerRaj._id,
      stationId: stations[1]._id,
      connectorId: connectors[3]._id,
      startTime: pastStart,
      endTime: pastEnd,
      status: 'completed',
      estimatedCost: 352,
      notes: 'Weekend charge session',
      vehicleInfo: customerRaj.preferredVehicle,
    });

    // Cancelled booking for Raj 4 days ago
    const cancelStart = new Date(now);
    cancelStart.setDate(cancelStart.getDate() - 4);
    cancelStart.setHours(16, 0, 0, 0);

    const cancelEnd = new Date(cancelStart);
    cancelEnd.setHours(17, 0, 0, 0);

    await Booking.create({
      bookingCode: generateBookingCode(),
      userId: customerRaj._id,
      stationId: stations[2]._id,
      connectorId: connectors[5]._id,
      startTime: cancelStart,
      endTime: cancelEnd,
      status: 'cancelled',
      estimatedCost: 256,
      notes: 'Trip rescheduled',
      vehicleInfo: customerRaj.preferredVehicle,
    });

    // Booking for Priya
    const priyaBookingStart = new Date(now);
    priyaBookingStart.setDate(priyaBookingStart.getDate() + 2);
    priyaBookingStart.setHours(12, 0, 0, 0);

    const priyaBookingEnd = new Date(priyaBookingStart);
    priyaBookingEnd.setHours(13, 0, 0, 0);

    await Booking.create({
      bookingCode: generateBookingCode(),
      userId: customerPriya._id,
      stationId: stations[3]._id,
      connectorId: connectors[7]._id,
      startTime: priyaBookingStart,
      endTime: priyaBookingEnd,
      status: 'confirmed',
      estimatedCost: 320,
      notes: 'Charging prior to airport pickup',
      vehicleInfo: customerPriya.preferredVehicle,
    });

    console.log('Seeding User Notifications...');
    await Notification.create([
      {
        userId: customerRaj._id,
        title: 'Welcome to ChargeSlot ⚡',
        message: 'Your account is active. Find stations, verify live connector status, and reserve slots with ease.',
        type: 'info',
      },
      {
        userId: customerRaj._id,
        title: 'Booking Confirmed ⚡',
        message: 'Your slot at Central EV Charging Hub (CCS2-01) for tomorrow at 10:00 AM is confirmed.',
        type: 'success',
      },
    ]);

    console.log('==============================================');
    console.log('⚡ CHARGESLOT DATABASE SEEDED SUCCESSFULLY!');
    console.log('==============================================');
    console.log('Admin Account:    admin@chargeslot.com / Admin@123');
    console.log('Customer Account: raj@chargeslot.com   / Customer@123');
    console.log('Stations Seeded:  5 stations with 11 connectors');
    console.log('==============================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
