#!/bin/bash
# Build script for Render deployment

echo "Installing server dependencies..."
npm install

echo "Installing client dependencies..."
cd client && npm install

echo "Building client..."
npm run build

echo "Build completed!" 