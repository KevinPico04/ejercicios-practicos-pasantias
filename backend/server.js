const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from the .env file
dotenv.config();

const app = express();
app.use(express.json());  // Middleware to parse JSON data


app.use(cors({
  origin: 'http://localhost:3000'  // Solo permite solicitudes de este origen
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))  // Success message
.catch((err) => console.error('Error connecting to MongoDB:', err));  // Log any error during connection

// Use user routes for handling user-related requests
app.use('/api/users', userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error stack to the console
  res.status(500).send('Something went wrong!');  // Send a generic error response to the client
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;  // Use the port defined in .env or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // Start the server
