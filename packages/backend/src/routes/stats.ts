import { Router } from 'express'
import { getStats, incrementDownload, incrementVisitor } from '../controllers/stats.js'

const router = Router()

router.get('/', getStats)
router.post('/visit', incrementVisitor)
router.post('/download', incrementDownload)

export default router
