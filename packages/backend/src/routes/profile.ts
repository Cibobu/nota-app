import { Router } from 'express'
import { getProfile, updateProfile, uploadLogo } from '../controllers/profile.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/', requireAuth, getProfile)
router.put('/', requireAuth, updateProfile)
router.post('/logo', requireAuth, upload.single('logo'), uploadLogo)

export default router
