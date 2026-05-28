import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// Helper function — generates a JWT token for a user
// We pass the user's id into the token payload
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // payload — data stored inside token
    process.env.JWT_SECRET,          // secret key — used to sign the token
    { expiresIn: '7d' }              // token expires in 7 days
  )
}

// ─────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    // Step 1: Get data from request body
    // When React sends a POST request, data comes in req.body
    const { name, email, password } = req.body

    // Step 2: Validate — make sure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields'
      })
    }

    // Step 3: Check if user already exists with this email
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Step 4: Create the user
    // Password gets hashed automatically by our pre-save hook
    const user = await User.create({
      name,
      email,
      password
    })

    // Step 5: Send back response with token
    // We never send the password back — even the hashed version
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    // Step 1: Get email and password from request
    const { email, password } = req.body

    // Step 2: Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Step 3: Find user by email
    const user = await User.findOne({ email })

    // Step 4: If no user found, reject
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Step 5: Compare entered password with stored hash
    // matchPassword is our custom method from User.js
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Step 6: Password matched — send back user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}