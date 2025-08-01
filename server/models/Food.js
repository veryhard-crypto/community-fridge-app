const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fruits', 'vegetables', 'dairy', 'bread', 'canned', 'frozen', 'pantry', 'other']
  },
  quantity: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['fresh', 'good', 'fair', 'expiring-soon']
  },
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'fish', 'shellfish', 'none']
  }],
  images: [{
    type: String
  }],
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pickupInstructions: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'claimed', 'expired'],
    default: 'available'
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reservedAt: {
    type: Date
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: {
    type: Date
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

foodSchema.index({ status: 1, expiryDate: 1 });
foodSchema.index({ 'location.city': 1, 'location.state': 1 });
foodSchema.index({ category: 1, status: 1 });

foodSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

foodSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

foodSchema.methods.canBeReserved = function() {
  return this.status === 'available' && !this.isExpired;
};

foodSchema.methods.canBeClaimed = function() {
  return this.status === 'reserved' && !this.isExpired;
};

module.exports = mongoose.model('Food', foodSchema); 