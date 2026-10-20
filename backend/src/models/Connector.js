const mongoose = require('mongoose');

const connectorSchema = new mongoose.Schema(
  {
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Station ID is required'],
      index: true,
    },
    label: {
      type: String,
      required: [true, 'Connector label is required (e.g. CCS2-01)'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Connector type is required'],
      enum: ['CCS2', 'Type 2', 'CHAdeMO', 'GB/T'],
      default: 'CCS2',
    },
    powerKw: {
      type: Number,
      required: [true, 'Power rating in kW is required'],
      min: [1, 'Power must be at least 1 kW'],
      default: 60,
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'offline'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

connectorSchema.index({ stationId: 1, label: 1 }, { unique: true });

module.exports = mongoose.model('Connector', connectorSchema);
