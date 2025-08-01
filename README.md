# Community Fridge App

A community-based platform connecting food donors with recipients to reduce food waste and address food insecurity in local communities.

## 🎯 Problem Statement

Food wastage is a major global issue, while at the same time many people in local communities struggle with food insecurity. Local restaurants, supermarkets, and even households often throw away surplus food that is still consumable. There is a lack of a simple, community-based platform that connects people who have surplus food with those who need it.

## ✨ Features

### For Food Donors
- **Easy Food Donation**: Simple form to list surplus food items
- **Food Categories**: Organize donations by type (fruits, vegetables, dairy, etc.)
- **Expiry Tracking**: Set expiry dates to ensure food safety
- **Location Sharing**: Specify pickup location for recipients
- **Donation History**: Track all your donations and their status

### For Food Recipients
- **Browse Available Food**: Search and filter food items by location, category, and expiry
- **Reserve Food**: Reserve items you're interested in
- **Claim Food**: Pick up reserved items
- **Donor Ratings**: See donor ratings for trust and safety

### Community Features
- **User Profiles**: Build trust with ratings and verification
- **Location-Based Matching**: Find food near you
- **Real-Time Updates**: See food availability in real-time
- **Safety Features**: User verification and rating system

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React.js** with functional components and hooks
- **Material-UI** for modern, responsive design
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community-fridge-new
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/community-fridge
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

6. **Run the development servers**

   **Option 1: Run both servers simultaneously**
   ```bash
   npm run dev
   ```

   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
community-fridge-new/
├── server/
│   ├── models/
│   │   ├── User.js          # User model with authentication
│   │   └── Food.js          # Food donation model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── food.js          # Food CRUD operations
│   │   └── users.js         # User management routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   └── index.js             # Main server file
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Login/Register components
│   │   │   ├── food/        # Food listing and details
│   │   │   ├── layout/      # Navbar and layout components
│   │   │   ├── pages/       # Page components
│   │   │   └── profile/     # User profile components
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Authentication context
│   │   └── App.js           # Main React component
│   └── package.json
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Food Management
- `GET /api/food` - Get all available food items (with filters)
- `GET /api/food/:id` - Get specific food item
- `POST /api/food` - Create new food donation
- `PUT /api/food/:id` - Update food donation
- `DELETE /api/food/:id` - Delete food donation
- `POST /api/food/:id/reserve` - Reserve food item
- `POST /api/food/:id/claim` - Claim reserved food
- `POST /api/food/:id/cancel-reservation` - Cancel reservation

### User Management
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/:id/activity` - Get user activity
- `GET /api/users/search` - Search users
- `POST /api/users/:id/rate` - Rate a user

## 🎨 Key Features Implemented

### User Authentication & Authorization
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes for authenticated users
- User profile management

### Food Donation System
- Comprehensive food item creation with categories
- Expiry date tracking and alerts
- Location-based food sharing
- Allergen information and safety details

### Food Discovery & Reservation
- Advanced filtering and search capabilities
- Real-time food availability
- Reservation and claiming system
- Pagination for large datasets

### Community Features
- User rating system for trust building
- Donation and receiving statistics
- User activity tracking
- Location-based community building

### Modern UI/UX
- Responsive Material-UI design
- Intuitive navigation and user flow
- Real-time form validation
- Loading states and error handling

## 🔒 Security Features

- **Password Security**: bcryptjs hashing with salt
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- MongoDB for the flexible database solution
- React community for the amazing frontend framework
- Express.js for the robust backend framework

---

**Community Fridge** - Connecting communities through food sharing and reducing waste, one donation at a time. 