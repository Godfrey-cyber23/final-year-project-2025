import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import lecturerRoutes from './routes/lecturer.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { notFound, errorHandler } from './middlewares/error.js';
import './config/database.js'; // Initialize DB connection

// Initialize Express app
const app = express();

// =============================================
// Enhanced CORS Configuration
// =============================================
const allowedOrigins = [
  'http://localhost:3000', // Default frontend port
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL // From environment variables
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'x-request-id'
  ],
  optionsSuccessStatus: 200 // Legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// =============================================
// Security Middleware
// =============================================
app.use(helmet());
app.use(morgan('dev')); // Logging

// =============================================
// Body Parsing Middleware
// =============================================
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =============================================
// Route Handlers
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// =============================================
// Error Handling
// =============================================
app.use(notFound);
app.use(errorHandler);

// =============================================
// Server Startup
// =============================================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
  
  // Database connection verification
  console.log('Database connection:', 
    process.env.DB_HOST ? 'Configured' : 'Not configured');
});