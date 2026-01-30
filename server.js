require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dynamicCorsMiddleware = require('./middleware/corsMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cors_management';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// Initialize the CORS middleware
app.use(dynamicCorsMiddleware);

// Sample Routes
app.get('/api/resource', (req, res) => {
    res.json({ message: 'Success! This resource is protected by dynamic CORS policies.' });
});

app.post('/api/resource', (req, res) => {
    res.json({ message: 'Resource updated!', received: req.body });
});

// App server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
