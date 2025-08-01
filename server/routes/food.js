const express = require('express');
const { body, validationResult } = require('express-validator');
const Food = require('../models/Food');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all available food items (with optional filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      city,
      state,
      status = 'available',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    const filter = { status };
    
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const foods = await Food.find(filter)
      .populate('donor', 'name rating profileImage')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Food.countDocuments(filter);

    res.json({
      foods,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get food item by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('donor', 'name rating profileImage phone')
      .populate('reservedBy', 'name')
      .populate('claimedBy', 'name');

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ food });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new food donation
router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['fruits', 'vegetables', 'dairy', 'bread', 'canned', 'frozen', 'pantry', 'other']).withMessage('Invalid category'),
  body('quantity').notEmpty().withMessage('Quantity is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('condition').isIn(['fresh', 'good', 'fair', 'expiring-soon']).withMessage('Invalid condition'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.zipCode').notEmpty().withMessage('Zip code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const foodData = {
      ...req.body,
      donor: req.user._id
    };

    const food = new Food(foodData);
    await food.save();

    // Update user's total donations
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDonations: 1 }
    });

    const populatedFood = await Food.findById(food._id)
      .populate('donor', 'name rating profileImage');

    res.status(201).json({
      message: 'Food donation created successfully',
      food: populatedFood
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food donation (only by donor)
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().isIn(['fruits', 'vegetables', 'dairy', 'bread', 'canned', 'frozen', 'pantry', 'other']).withMessage('Invalid category'),
  body('quantity').optional().notEmpty().withMessage('Quantity is required'),
  body('expiryDate').optional().isISO8601().withMessage('Valid expiry date is required'),
  body('condition').optional().isIn(['fresh', 'good', 'fair', 'expiring-soon']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this food item' });
    }

    if (food.status !== 'available') {
      return res.status(400).json({ message: 'Cannot update food that is reserved or claimed' });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('donor', 'name rating profileImage');

    res.json({
      message: 'Food donation updated successfully',
      food: updatedFood
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reserve food item
router.post('/:id/reserve', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (!food.canBeReserved()) {
      return res.status(400).json({ message: 'Food item cannot be reserved' });
    }

    if (food.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot reserve your own donation' });
    }

    food.status = 'reserved';
    food.reservedBy = req.user._id;
    food.reservedAt = new Date();
    await food.save();

    const populatedFood = await Food.findById(food._id)
      .populate('donor', 'name rating profileImage')
      .populate('reservedBy', 'name');

    res.json({
      message: 'Food item reserved successfully',
      food: populatedFood
    });
  } catch (error) {
    console.error('Reserve food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim food item
router.post('/:id/claim', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (!food.canBeClaimed()) {
      return res.status(400).json({ message: 'Food item cannot be claimed' });
    }

    if (food.reservedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the person who reserved can claim this food' });
    }

    food.status = 'claimed';
    food.claimedBy = req.user._id;
    food.claimedAt = new Date();
    await food.save();

    // Update user's total received
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalReceived: 1 }
    });

    const populatedFood = await Food.findById(food._id)
      .populate('donor', 'name rating profileImage')
      .populate('claimedBy', 'name');

    res.json({
      message: 'Food item claimed successfully',
      food: populatedFood
    });
  } catch (error) {
    console.error('Claim food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel reservation
router.post('/:id/cancel-reservation', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (food.status !== 'reserved') {
      return res.status(400).json({ message: 'Food item is not reserved' });
    }

    if (food.reservedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the person who reserved can cancel the reservation' });
    }

    food.status = 'available';
    food.reservedBy = null;
    food.reservedAt = null;
    await food.save();

    const populatedFood = await Food.findById(food._id)
      .populate('donor', 'name rating profileImage');

    res.json({
      message: 'Reservation cancelled successfully',
      food: populatedFood
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food donation (only by donor)
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this food item' });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({ message: 'Food donation deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's food donations
router.get('/user/donations', auth, async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user._id })
      .populate('reservedBy', 'name')
      .populate('claimedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ foods });
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reserved/claimed food
router.get('/user/received', auth, async (req, res) => {
  try {
    const foods = await Food.find({
      $or: [
        { reservedBy: req.user._id },
        { claimedBy: req.user._id }
      ]
    })
    .populate('donor', 'name rating profileImage')
    .sort({ createdAt: -1 });

    res.json({ foods });
  } catch (error) {
    console.error('Get user received error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 