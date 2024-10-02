import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

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
const connectDB = async (email: string) => {
  try {
    console.log("connectDB", email);
    await mongoose.disconnect();
    const DB_URI = `${process.env.ATLAS_URI}${email}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected...');
  } catch (err: any) {
    console.error(err.message);
    console.log('Disconnecting and retrying connection immediately...');
    try {
      await mongoose.disconnect();
    } catch (disconnectErr: any) {
      console.error('Error during disconnection:', disconnectErr.message);
    }
    setTimeout(async () => {
      await connectDB(email);
    }, 0);
  }
};

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