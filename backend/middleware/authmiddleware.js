import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token

    // Step 1: Check if Authorization header exists and starts with 'Bearer'
    // Frontend sends token as:  Authorization: Bearer eyJhbGc...
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Step 2: Extract just the token part (remove 'Bearer ')
      token = req.headers.authorization.split(' ')[1]
    }

    // Step 3: If no token found, reject the request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      })
    }

    // Step 4: Verify the token using our JWT_SECRET
    // If token is expired or tampered, this throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Step 5: Find the user from the id stored in the token
    // .select('-password') means fetch everything EXCEPT password
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      })
    }

    // Step 6: Attach user to request object
    // Now any controller after this middleware can access req.user
    req.user = user

    // Step 7: Call next() to pass control to the next middleware or controller
    next()

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    })
  }
}