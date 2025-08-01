#!/bin/bash
# Build script for Render deployment

echo "=== Starting build process ==="

echo "Installing server dependencies..."
npm install

echo "Installing client dependencies..."
cd client && npm install

echo "Building client..."
npm run build

echo "Checking if build was successful..."
if [ -d "build" ]; then
    echo "✅ Build directory created successfully"
    ls -la build/
else
    echo "❌ Build directory not found"
    exit 1
fi

echo "=== Build completed! ===" 