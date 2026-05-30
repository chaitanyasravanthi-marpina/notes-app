// Step 1: Load .env variables into process.env
// This must be the FIRST thing that runs — before anything else
import dotenv from 'dotenv'
dotenv.config()

// Step 2: Import Express to create our web server
import express from 'express'


// Step 3: Import cors middleware
// This allows our React frontend (on port 3000) to talk to this
// backend (on port 5000). Without this, the browser blocks the request.
import cors from 'cors'
import connectDB from './config/db.js'   
import authRoutes from './routes/authRoutes.js' 

import noteRoutes from './routes/noteRoutes.js' 


// Step 4: Create the Express application
// This 'app' object is our entire server
const app = express()
// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',           // local development
    process.env.FRONTEND_URL           // production frontend URL
  ],
  credentials: true,
}

// Step 5: Set up middleware
// These run on EVERY incoming request, before any route handler

// Allows Express to read JSON data from request body
// Without this, req.body would be undefined
app.use(express.json())

// Allows cross-origin requests from our React frontend
app.use(cors(corsOptions))
// ← ADD THIS — connect to database when server starts
connectDB()

// Mount auth routes — all auth URLs start with /api/auth
app.use('/api/auth', authRoutes)    
app.use('/api/notes', noteRoutes)
// Step 6: A test route to confirm the server is working
// We'll replace this with real routes later
app.get('/', (req, res) => {
  res.json({ message: 'Notes API is running' })
})

// Step 7: Read port from .env, fallback to 5000 if not set
const PORT = process.env.PORT || 5000

// Step 8: Start the server — begin listening for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})