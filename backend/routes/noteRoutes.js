import express from 'express'
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  getTrashedNotes,
  restoreNote,
  permanentDeleteNote
} from '../controllers/noteController.js'
import { protect } from '../middleware/authmiddleware.js'

const router = express.Router()

// All routes use protect middleware
// Every request must have a valid JWT token

router.post('/',              protect, createNote)
router.get('/',               protect, getNotes)
router.get('/trash',          protect, getTrashedNotes)
router.get('/:id',            protect, getNoteById)
router.put('/:id',            protect, updateNote)
router.delete('/:id',         protect, deleteNote)
router.put('/:id/pin',        protect, togglePin)
router.put('/:id/archive',    protect, toggleArchive)
router.put('/:id/restore',    protect, restoreNote)
router.delete('/:id/permanent', protect, permanentDeleteNote)

export default router