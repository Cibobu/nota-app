import { Router } from 'express'
import { getPublicNote } from '../controllers/public.js'

const router = Router()

router.get('/notes/:token', getPublicNote)

export default router
