import { Router } from 'express'
import { generateHandover, simplifyConsent, reportIncident } from '../controllers/ai.controller'

const router = Router()

router.post('/handovers', generateHandover)
router.post('/consents/simplify', simplifyConsent)
router.post('/incidents', reportIncident)

export default router
