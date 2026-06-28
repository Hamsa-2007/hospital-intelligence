import { Router } from 'express'
import { getStaffDirectory } from '../controllers/admin.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/staff', authenticate, getStaffDirectory)

export default router
