import { Router } from 'express'
import { getDoctorPatients, getDoctorSchedule } from '../controllers/doctor.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/:id/patients', authenticate, getDoctorPatients)
router.get('/:id/schedule', authenticate, getDoctorSchedule)

export default router
