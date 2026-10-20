const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().default(''),
  preferredVehicle: z
    .object({
      model: z.string().optional(),
      regNumber: z.string().optional(),
    })
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
  preferredVehicle: z
    .object({
      model: z.string().optional(),
      regNumber: z.string().optional(),
    })
    .optional(),
});

const stationSchema = z.object({
  name: z.string().min(2, 'Station name is required').max(150),
  description: z.string().optional().default(''),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Opening time must be HH:mm').optional(),
  closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Closing time must be HH:mm').optional(),
  pricePerKwh: z.number().min(0, 'Price per kWh must be non-negative'),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

const connectorSchema = z.object({
  stationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid station ID'),
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['CCS2', 'Type 2', 'CHAdeMO', 'GB/T']),
  powerKw: z.number().min(1, 'Power must be at least 1 kW'),
  status: z.enum(['available', 'maintenance', 'offline']).optional(),
});

const bookingSchema = z.object({
  stationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid station ID'),
  connectorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid connector ID'),
  startTime: z.string().datetime({ message: 'Start time must be a valid ISO timestamp' }),
  endTime: z.string().datetime({ message: 'End time must be a valid ISO timestamp' }),
  notes: z.string().optional().default(''),
  vehicleInfo: z
    .object({
      model: z.string().optional(),
      regNumber: z.string().optional(),
    })
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  stationSchema,
  connectorSchema,
  bookingSchema,
};
