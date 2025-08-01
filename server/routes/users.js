const express = require('express');
const User = require('../models/User');
const Food = require('../models/Food');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get donation statistics
    const donationStats = await Food.aggregate([
      { $match: { donor: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get received statistics
    const receivedStats = await Food.aggregate([
      {
        $match: {
          $or: [
            { reservedBy: user._id },
            { claimedBy: user._id }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalDonations: user.totalDonations,
      totalReceived: user.totalReceived,
      rating: user.rating,
      donations: {
        available: 0,
        reserved: 0,
        claimed: 0,
        expired: 0
      },
      received: {
        reserved: 0,
        claimed: 0
      }
    };

    // Process donation stats
    donationStats.forEach(stat => {
      if (stats.donations.hasOwnProperty(stat._id)) {
        stats.donations[stat._id] = stat.count;
      }
    });

    // Process received stats
    receivedStats.forEach(stat => {
      if (stats.received.hasOwnProperty(stat._id)) {
        stats.received[stat._id] = stat.count;
      }
    });

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's recent activity
router.get('/:id/activity', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { limit = 10 } = req.query;

    // Get recent donations
    const recentDonations = await Food.find({ donor: user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('reservedBy', 'name')
      .populate('claimedBy', 'name');

    // Get recent received items
    const recentReceived = await Food.find({
      $or: [
        { reservedBy: user._id },
        { claimedBy: user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('donor', 'name rating profileImage');

    res.json({
      donations: recentDonations,
      received: recentReceived
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, userType, city, state } = req.query;
    
    const filter = {};
    
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') }
      ];
    }
    
    if (userType) {
      filter.userType = userType;
    }
    
    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      filter['address.state'] = new RegExp(state, 'i');
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ name: 1 })
      .limit(20);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a user
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const userToRate = await User.findById(req.params.id);
    
    if (!userToRate) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToRate._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot rate yourself' });
    }

    // Check if user has interacted with the user they're rating
    const hasInteraction = await Food.findOne({
      $or: [
        { donor: req.user._id, reservedBy: userToRate._id },
        { donor: req.user._id, claimedBy: userToRate._id },
        { donor: userToRate._id, reservedBy: req.user._id },
        { donor: userToRate._id, claimedBy: req.user._id }
      ]
    });

    if (!hasInteraction) {
      return res.status(400).json({ message: 'You can only rate users you have interacted with' });
    }

    // For now, we'll just update the average rating
    // In a real app, you'd want to store individual ratings
    const currentRating = userToRate.rating;
    const totalRatings = userToRate.totalDonations + userToRate.totalReceived;
    const newRating = totalRatings > 0 ? 
      ((currentRating * totalRatings) + rating) / (totalRatings + 1) : rating;

    userToRate.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    await userToRate.save();

    res.json({ 
      message: 'Rating submitted successfully',
      newRating: userToRate.rating
    });
  } catch (error) {
    console.error('Rate user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin (you can add admin role to user model later)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 