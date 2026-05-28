import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    // The title of the note
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    // The main content of the note
    content: {
      type: String,
      default: '',
    },

    // Reference to the User who owns this note
    // This is how MongoDB knows which user a note belongs to
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Is this note pinned to the top?
    isPinned: {
      type: Boolean,
      default: false,
    },

    // Is this note archived?
    // Archived notes are hidden from main view but not deleted
    isArchived: {
      type: Boolean,
      default: false,
    },

    // Is this note in the trash?
    // Soft delete — we don't actually remove from database immediately
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // When was it moved to trash?
    // We'll use this later to auto-delete after 30 days
    deletedAt: {
      type: Date,
      default: null,
    },

    // Tags/categories for organizing notes
    // Stored as array: ['work', 'personal', 'ideas']
    tags: {
      type: [String],
      default: [],
    },

    // Background color of the note card in UI
    color: {
      type: String,
      default: '#ffffff',
    },
  },

  {
    timestamps: true,
  }
)

// Index for faster search queries
// When user searches notes, MongoDB uses this index
// instead of scanning every document — much faster
noteSchema.index({ title: 'text', content: 'text' })

// Index on user field — we query by user constantly
// This makes Note.find({ user: id }) very fast
noteSchema.index({ user: 1 })

const Note = mongoose.model('Note', noteSchema)

export default Note