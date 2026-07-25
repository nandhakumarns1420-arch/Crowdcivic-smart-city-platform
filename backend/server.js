import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import complaintRoutes from './src/routes/complaintRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import errorHandler from './src/middleware/error.js';

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/*
=====================================================
CORS CONFIGURATION
=====================================================
*/

// Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman, curl, mobile apps (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/*
=====================================================
SECURITY
=====================================================
*/

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'unsafe-none' }
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

/*
=====================================================
HEALTH CHECK
=====================================================
*/

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CrowdCivic Backend API is running successfully.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/*
=====================================================
API ROUTES
=====================================================
*/

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);

/*
=====================================================
ERROR HANDLER
=====================================================
*/

app.use(errorHandler);

/*
=====================================================
SERVER
=====================================================
*/

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CrowdCivic Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

/*
=====================================================
UNHANDLED PROMISE REJECTIONS
=====================================================
*/

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);

  server.close(() => process.exit(1));
});