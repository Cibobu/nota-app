import { Router } from 'express'
import {
  createNote,
  getNextNoteNumberHandler,
  getNoteById,
  getNotes,
} from '../controllers/notes.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getNotes)
router.get('/next-number', requireAuth, getNextNoteNumberHandler)
router.get('/:id', requireAuth, getNoteById)
router.post('/', requireAuth, createNote)

export default router
