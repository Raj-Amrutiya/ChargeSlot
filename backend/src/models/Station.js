const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Station name is required'],
      trim: true,
      maxlength: [150, 'Station name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (coords) {
            return (
              Array.isArray(coords) &&
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message: 'Coordinates must be valid [longitude, latitude] in degrees',
        },
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    },
    openingTime: {
      type: String,
      default: '06:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Opening time must be in HH:mm format'],
    },
    closingTime: {
      type: String,
      default: '23:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Closing time must be in HH:mm format'],
    },
    pricePerKwh: {
      type: Number,
      required: [true, 'Price per kWh is required'],
      min: [0, 'Price cannot be negative'],
      default: 18,
    },
    amenities: {
      type: [String],
      default: ['Parking', 'Restroom', 'Café', 'Wi-Fi'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

stationSchema.index({ location: '2dsphere' });
stationSchema.index({ city: 1, status: 1 });
stationSchema.index({ name: 'text', address: 'text', city: 'text' });

module.exports = mongoose.model('Station', stationSchema);
