const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-fridge';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit the process, let the app continue without DB
    console.log('Continuing without database connection...');
  }
};

// Initialize database connection
connectDB();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const userRoutes = require('./routes/users');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/users', userRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Community Fridge API is running!' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  const indexPath = path.join(buildPath, 'index.html');
  
  console.log('Production mode - serving static files');
  console.log('Build path:', buildPath);
  console.log('Index path:', indexPath);
  
  // Check if build directory exists
  if (fs.existsSync(buildPath)) {
    console.log('Build directory exists');
    app.use(express.static(buildPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      console.log('Serving React app for:', req.path);
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ 
          error: 'React app not found',
          buildPath: buildPath,
          indexPath: indexPath,
          buildExists: fs.existsSync(buildPath),
          indexExists: fs.existsSync(indexPath)
        });
      }
    });
  } else {
    console.log('Build directory does not exist, serving API only');
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Community Fridge App</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .endpoint { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 Community Fridge App</h1>
            <p>Your API is running successfully! The React app is not built yet.</p>
            <h2>Available Endpoints:</h2>
            <div class="endpoint"><strong>Health Check:</strong> <a href="/health">/health</a></div>
            <div class="endpoint"><strong>API Test:</strong> <a href="/api/test">/api/test</a></div>
            <div class="endpoint"><strong>Auth Routes:</strong> /api/auth/*</div>
            <div class="endpoint"><strong>Food Routes:</strong> /api/food/*</div>
            <div class="endpoint"><strong>User Routes:</strong> /api/users/*</div>
            <p><em>Check your Render logs to see why the React app isn't building.</em></p>
          </div>
        </body>
        </html>
      `);
    });
    
    app.get('*', (req, res) => {
      res.json({ 
        message: 'API is running but React app is not built',
        buildPath: buildPath,
        exists: fs.existsSync(buildPath),
        availableEndpoints: ['/health', '/api/test', '/api/auth', '/api/food', '/api/users']
      });
    });
  }
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
}); 