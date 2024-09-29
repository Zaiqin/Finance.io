const express = require('express');
const connectDB = require('./db'); // Import the connectDB function
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Define Routes
// Use CORS middleware
app.use(cors());

// Define Routes
app.use('/api/finances', require('./routes/finances'));
app.use('/api/travel', require('./routes/travel'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));