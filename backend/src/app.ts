import express, { Request, Response } from 'express';
const connectDB = require('./db'); // Import the connectDB function
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors());

// Define Routes
app.use('/api/finances', require('./routes/finances'));
app.use('/api/travel', require('./routes/travel'));
app.use('/api/presets', require('./routes/presets'));
app.use('/api/categories', require('./routes/category'));

// Connect to MongoDB
app.post('/api/connect-db', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  await connectDB(email);
  res.json({ message: 'Connected to MongoDB' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));