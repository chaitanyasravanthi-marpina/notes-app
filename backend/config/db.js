// Import mongoose — our bridge between Node.js and MongoDB
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise — we await it
    const conn = await mongoose.connect(process.env.MONGO_URI)

    // conn.connection.host tells us which server we connected to
    // This confirms exactly which database we're talking to
    console.log(`MongoDB Connected: ${conn.connection.host}`)

  } catch (error) {
    // If connection fails, log the exact error and exit the process
    // There's no point running the server without a database
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB