import { Router } from 'express'
import { getPatientRecords, getPatientAppointments } from '../controllers/patient.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// In a real app we'd verify that req.user.id === req.params.id
router.get('/:id/records', authenticate, getPatientRecords)
router.get('/:id/appointments', authenticate, getPatientAppointments)

export default router
