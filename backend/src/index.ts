import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import aiRoutes from './routes/ai.routes'
import patientRoutes from './routes/patient.routes'
import adminRoutes from './routes/admin.routes'
import doctorRoutes from './routes/doctor.routes'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/doctors', doctorRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hospital Intelligence API is running' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
