import { Router } from 'express'
import multer from 'multer'
import { getProfile, updateProfile, uploadLogo } from '../controllers/profile.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
})

router.get('/', requireAuth, getProfile)
router.put('/', requireAuth, updateProfile)
router.post('/upload-logo', requireAuth, upload.single('logo'), uploadLogo)

export default router
