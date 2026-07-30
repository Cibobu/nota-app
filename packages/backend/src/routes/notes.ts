import { Router } from 'express'
import { createNote, getNoteById, getNotes } from '../controllers/notes.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getNotes)
router.get('/:id', requireAuth, getNoteById)
router.post('/', requireAuth, createNote)

export default router
