import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Step 1: Define the Schema — the blueprint for every user document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],  // custom error message
      trim: true,                             // removes accidental spaces
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,          // no two users can have the same email
      lowercase: true,       // always store as lowercase
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    isVerified: {
      type: Boolean,
      default: false,   // every new user starts unverified
    },

    profilePicture: {
      type: String,
      default: '',      // empty string means no picture yet
    },
  },

  {
    // This option auto-creates two fields for us:
    // createdAt — when the document was first saved
    // updatedAt — when the document was last changed
    timestamps: true,
  }
)

// Step 2: Pre-save middleware
// This runs AUTOMATICALLY before every .save() call
// If password was changed, hash it before storing
userSchema.pre('save', async function () {
  // 'this' refers to the current user document being saved

  // Only hash if password field was actually modified
  // This prevents re-hashing an already hashed password
  // on profile updates
  if (!this.isModified('password')) {
    return 

    
  }

  // Generate a salt — random data added to password before hashing
  // 10 is the number of rounds — higher = more secure but slower
  // 10 is the industry standard

  const salt = await bcrypt.genSalt(10)
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt)

  
})

// Step 3: Instance method
// This adds a custom method to every user document
// We'll use this in the login controller
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare hashes the enteredPassword and compares
  // it against the stored hash — returns true or false
  return await bcrypt.compare(enteredPassword, this.password)
}

// Step 4: Create the Model from the Schema
// 'User' becomes the collection name as 'users' in MongoDB
const User = mongoose.model('User', userSchema)

export default User