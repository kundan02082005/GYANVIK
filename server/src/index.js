import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import testRoutes from './routes/testRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import discoveryRoutes from './routes/discoveryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'GYANVIK – One Platform. Many Examinations. Clearer Opportunities.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend production build from client/dist if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('GYANVIK API Server is running. Frontend is available via Vite dev server at http://localhost:5173.');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 GYANVIK Server running on http://localhost:${PORT}`);
  console.log(`📡 Tagline: One Platform. Many Examinations. Clearer Opportunities.`);
  console.log(`================================================================`);
});
