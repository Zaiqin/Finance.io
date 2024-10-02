import { Request, Response } from 'express';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

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

// Use CORS middleware
app.use(cors());

// Define Routes
app.use('/api/finances', require('./routes/finances'));
app.use('/api/travel', require('./routes/travel'));
app.use('/api/presets', require('./routes/presets'));
app.use('/api/categories', require('./routes/category'));


// Connect-DB Endpoint
app.post('/api/connect-db', async (req: Request, res: Response) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ message: 'Connected to MongoDB' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).json({ message: 'Failed to connect to MongoDB' });
    } else {
      console.error('Unknown error');
      res.status(500).json({ message: 'Failed to connect to MongoDB' });
    }
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));