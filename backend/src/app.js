const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const stationRoutes = require('./routes/station.routes');
const connectorRoutes = require('./routes/connector.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Body and Cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'chargeslot_cookie_signing_secret_987654321'));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoints for Kubernetes and Docker probes
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ChargeSlot API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/connectors', connectorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve the built React frontend from the same container
const frontendPath = path.join(__dirname, '..', 'public');
app.use(express.static(frontendPath));

// Return the React app for browser routes, but keep unknown API routes as JSON 404s
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 handler for unhandled API routes and other requests
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' with method '${req.method}' not found`,
  });
});

// Global centralized error handler
app.use(errorHandler);

module.exports = app;
