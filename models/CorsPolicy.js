const mongoose = require('mongoose');

const CorsPolicySchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  allowedMethods: {
    type: [String],
    default: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  allowedHeaders: {
    type: [String],
    default: ['Content-Type', 'Authorization']
  },
  maxAge: {
    type: Number,
    default: 86400 // 24 hours in seconds
  },
  allowCredentials: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CorsPolicy', CorsPolicySchema);
