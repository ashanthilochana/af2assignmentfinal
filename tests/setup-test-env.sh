#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd ../backend
npm install
npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
while ! curl -s http://localhost:3000/api/auth/register > /dev/null; do
    sleep 1
done

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
while ! curl -s http://localhost:5174 > /dev/null; do
    sleep 1
done

echo "Both servers are running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Run the tests
cd ../tests
npm test functional/register.test.js

# Cleanup
kill $BACKEND_PID
kill $FRONTEND_PID
