const mongoose = require('mongoose');
const Food = require('./models/Food');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const categoryImages = {
  fruits: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
  dairy: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
  canned: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop",
  frozen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  pantry: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop",
  other: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
};

const sampleFoods = [
  {
    title: "Fresh Organic Bananas",
    description: "A bunch of ripe organic bananas, perfect for smoothies or baking. Grown locally without pesticides.",
    category: "fruits",
    quantity: "1 bunch (6-8 bananas)",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    condition: "fresh",
    allergens: ["none"],
    images: [categoryImages.fruits],
    location: {
      address: "123 Main Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "Available on front porch. Please ring doorbell when picking up.",
    status: "available",
    isUrgent: false,
    tags: ["organic", "local", "ripe"]
  },
  {
    title: "Fresh Tomatoes",
    description: "Homegrown tomatoes from my garden. Sweet and juicy, perfect for salads or cooking.",
    category: "vegetables",
    quantity: "2 lbs",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    condition: "fresh",
    allergens: ["none"],
    images: [categoryImages.vegetables],
    location: {
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In a basket by the garage door. Text when arriving.",
    status: "available",
    isUrgent: false,
    tags: ["homegrown", "organic", "fresh"]
  },
  {
    title: "Whole Grain Bread",
    description: "Freshly baked whole grain bread from local bakery. High in fiber and nutrients.",
    category: "bread",
    quantity: "2 loaves",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    condition: "good",
    allergens: ["gluten"],
    images: [categoryImages.bread],
    location: {
      address: "789 Pine Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62703",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "On kitchen counter. Please knock before entering.",
    status: "available",
    isUrgent: false,
    tags: ["whole grain", "local bakery", "fresh"]
  },
  {
    title: "Greek Yogurt",
    description: "Plain Greek yogurt, high in protein. Great for smoothies or as a healthy snack.",
    category: "dairy",
    quantity: "4 containers (6oz each)",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    condition: "good",
    allergens: ["dairy"],
    images: [categoryImages.dairy],
    location: {
      address: "321 Elm Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In refrigerator. Please text 10 minutes before arrival.",
    status: "available",
    isUrgent: true,
    tags: ["protein", "healthy", "plain"]
  },
  {
    title: "Canned Black Beans",
    description: "Organic black beans in water. No salt added, perfect for healthy meals.",
    category: "canned",
    quantity: "6 cans",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    condition: "good",
    allergens: ["none"],
    images: [categoryImages.canned],
    location: {
      address: "654 Maple Drive",
      city: "Springfield",
      state: "IL",
      zipCode: "62705",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In pantry. Available anytime, just knock.",
    status: "available",
    isUrgent: false,
    tags: ["organic", "no salt", "protein"]
  },
  {
    title: "Frozen Mixed Vegetables",
    description: "Frozen broccoli, carrots, and peas. Flash frozen to preserve nutrients.",
    category: "frozen",
    quantity: "3 bags (16oz each)",
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    condition: "good",
    allergens: ["none"],
    images: [categoryImages.frozen],
    location: {
      address: "987 Cedar Lane",
      city: "Springfield",
      state: "IL",
      zipCode: "62706",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In freezer. Please call before coming.",
    status: "available",
    isUrgent: false,
    tags: ["frozen", "mixed vegetables", "nutritious"]
  },
  {
    title: "Apples",
    description: "Crisp red apples from local orchard. Sweet and perfect for snacking.",
    category: "fruits",
    quantity: "1 bag (about 8 apples)",
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    condition: "fresh",
    allergens: ["none"],
    images: [categoryImages.fruits],
    location: {
      address: "147 Birch Road",
      city: "Springfield",
      state: "IL",
      zipCode: "62707",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In fruit bowl on kitchen table.",
    status: "available",
    isUrgent: false,
    tags: ["local", "sweet", "crisp"]
  },
  {
    title: "Pasta",
    description: "Whole wheat spaghetti pasta. High in fiber and perfect for healthy meals.",
    category: "pantry",
    quantity: "4 boxes (16oz each)",
    expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
    condition: "good",
    allergens: ["gluten"],
    images: [categoryImages.pantry],
    location: {
      address: "258 Spruce Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62708",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In pantry cabinet. Available anytime.",
    status: "available",
    isUrgent: false,
    tags: ["whole wheat", "pasta", "fiber"]
  },
  {
    title: "Milk",
    description: "Fresh whole milk from local dairy. Pasteurized and ready to drink.",
    category: "dairy",
    quantity: "2 gallons",
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    condition: "fresh",
    allergens: ["dairy"],
    images: [categoryImages.dairy],
    location: {
      address: "369 Willow Way",
      city: "Springfield",
      state: "IL",
      zipCode: "62709",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In refrigerator. Please pick up today.",
    status: "available",
    isUrgent: true,
    tags: ["fresh", "local dairy", "whole milk"]
  },
  {
    title: "Carrots",
    description: "Fresh organic carrots from my garden. Sweet and crunchy, perfect for snacking or cooking.",
    category: "vegetables",
    quantity: "1 bag (about 2 lbs)",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    condition: "fresh",
    allergens: ["none"],
    images: [categoryImages.vegetables],
    location: {
      address: "741 Poplar Drive",
      city: "Springfield",
      state: "IL",
      zipCode: "62710",
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    pickupInstructions: "In vegetable drawer of refrigerator.",
    status: "available",
    isUrgent: false,
    tags: ["organic", "homegrown", "sweet"]
  }
];

// Sample users
const sampleUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    phone: "555-0101",
    address: {
      street: "123 Main Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701"
    },
    userType: "both",
    rating: 4.8,
    totalDonations: 15,
    totalReceived: 3
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    phone: "555-0102",
    address: {
      street: "456 Oak Avenue",
      city: "Springfield",
      state: "IL",
      zipCode: "62702"
    },
    userType: "donor",
    rating: 4.9,
    totalDonations: 22,
    totalReceived: 0
  },
  {
    name: "Emily Davis",
    email: "emily@example.com",
    password: "password123",
    phone: "555-0103",
    address: {
      street: "789 Pine Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62703"
    },
    userType: "both",
    rating: 4.7,
    totalDonations: 8,
    totalReceived: 5
  },
  {
    name: "David Wilson",
    email: "david@example.com",
    password: "password123",
    phone: "555-0104",
    address: {
      street: "321 Elm Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62704"
    },
    userType: "donor",
    rating: 4.6,
    totalDonations: 12,
    totalReceived: 1
  },
  {
    name: "Lisa Brown",
    email: "lisa@example.com",
    password: "password123",
    phone: "555-0105",
    address: {
      street: "654 Maple Drive",
      city: "Springfield",
      state: "IL",
      zipCode: "62705"
    },
    userType: "both",
    rating: 4.5,
    totalDonations: 6,
    totalReceived: 4
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-fridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Food.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create sample foods with user references
    for (let i = 0; i < sampleFoods.length; i++) {
      const foodData = {
        ...sampleFoods[i],
        donor: createdUsers[i % createdUsers.length]._id
      };
      const food = new Food(foodData);
      await food.save();
      console.log(`Created food: ${food.title}`);
    }

    console.log('Sample data seeded successfully!');
    console.log(`Created ${createdUsers.length} users and ${sampleFoods.length} food items`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData(); 