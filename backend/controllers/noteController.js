import Note from '../models/Note.js'

// ─────────────────────────────────────────
// @desc    Create a new note
// @route   POST /api/notes
// @access  Protected
// ─────────────────────────────────────────
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, color } = req.body

    // Validate — title is required
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      })
    }

    // Create note — user comes from req.user (auth middleware)
    // We never trust the frontend to send the user id
    // We always get it from the verified token
    const note = await Note.create({
      title,
      content,
      tags,
      color,
      user: req.user.id    // ← from auth middleware, not from req.body
    })

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Protected
// ─────────────────────────────────────────
export const getNotes = async (req, res) => {
  try {
    // Get query params for filtering
    // Example: /api/notes?search=meeting&tag=work
    const { search, tag } = req.query

    // Base filter — always filter by user and not deleted
    // This ensures users ONLY see their own notes
    let filter = {
      user: req.user.id,
      isDeleted: false,
      isArchived: false
    }

    // If search query provided, use MongoDB text search
    if (search) {
      filter.$text = { $search: search }
    }

    // If tag filter provided, filter by that tag
    if (tag) {
      filter.tags = { $in: [tag] }
    }

    // Fetch notes — pinned notes come first, then by latest
    const notes = await Note.find(filter).sort({
      isPinned: -1,    // pinned notes first (true = 1, false = 0)
      createdAt: -1    // then newest first
    })

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Protected
// ─────────────────────────────────────────
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    // Check note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    // Check this note belongs to the logged in user
    // This prevents user A from reading user B's notes
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this note'
      })
    }

    res.status(200).json({
      success: true,
      note
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Protected
// ─────────────────────────────────────────
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    // Ownership check — same pattern as getNoteById
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note'
      })
    }

    // Update only the fields that were sent
    // If a field wasn't sent, keep the existing value
    const { title, content, tags, color } = req.body

    note.title   = title   ?? note.title
    note.content = content ?? note.content
    note.tags    = tags    ?? note.tags
    note.color   = color   ?? note.color

    const updatedNote = await note.save()

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Move note to trash (soft delete)
// @route   DELETE /api/notes/:id
// @access  Protected
// ─────────────────────────────────────────
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      })
    }

    // Soft delete — move to trash, don't remove from database
    note.isDeleted = true
    note.deletedAt = new Date()    // record when it was trashed
    await note.save()

    res.status(200).json({
      success: true,
      message: 'Note moved to trash'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Toggle pin on a note
// @route   PUT /api/notes/:id/pin
// @access  Protected
// ─────────────────────────────────────────
export const togglePin = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }

    // Toggle — if pinned, unpin. if unpinned, pin.
    note.isPinned = !note.isPinned
    await note.save()

    res.status(200).json({
      success: true,
      message: note.isPinned ? 'Note pinned' : 'Note unpinned',
      isPinned: note.isPinned
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Toggle archive on a note
// @route   PUT /api/notes/:id/archive
// @access  Protected
// ─────────────────────────────────────────
export const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }

    note.isArchived = !note.isArchived
    await note.save()

    res.status(200).json({
      success: true,
      message: note.isArchived ? 'Note archived' : 'Note unarchived',
      isArchived: note.isArchived
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Get all trashed notes
// @route   GET /api/notes/trash
// @access  Protected
// ─────────────────────────────────────────
export const getTrashedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
      isDeleted: true
    }).sort({ deletedAt: -1 })

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Restore note from trash
// @route   PUT /api/notes/:id/restore
// @access  Protected
// ─────────────────────────────────────────
export const restoreNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      }) 
    }

    note.isDeleted = false
    note.deletedAt = null
    note.isArchived = false  
    await note.save()

    res.status(200).json({
      success: true,
      message: 'Note restored successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ─────────────────────────────────────────
// @desc    Permanently delete a note
// @route   DELETE /api/notes/:id/permanent
// @access  Protected
// ─────────────────────────────────────────
export const permanentDeleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }

    // This actually removes the document from database
    await Note.deleteOne({ _id: req.params.id })

    res.status(200).json({
      success: true,
      message: 'Note permanently deleted'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}