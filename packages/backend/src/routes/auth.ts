import { Router } from 'express'
import { getMe, login } from '../controllers/auth.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', login)
router.get('/me', requireAuth, getMe)

export default router
