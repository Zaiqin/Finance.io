const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
import { Request, Response, NextFunction } from 'express';

// Allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err: any) => {
    console.error(err.message);
    process.exit(1);
  });

// Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware to restrict access
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || req.headers.referer;
  if (origin && allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).json({ message: 'Access forbidden: Origin not allowed' });
  }
});

// Use CORS middleware
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization,User',
  credentials: true,
  maxAge: 3600,
  optionsSuccessStatus: 204
}));

// Define Routes
app.use('/api/finances', require('./routes/finances'));
app.use('/api/travel', require('./routes/travel'));
app.use('/api/presets', require('./routes/presets'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/tags', require('./routes/tag'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));