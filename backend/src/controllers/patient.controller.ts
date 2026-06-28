import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getPatientRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params // This is the User ID for the patient

    // Find the Patient profile that matches this user ID
    const patient = await prisma.patient.findUnique({
      where: { userId: String(id) },
    })

    if (!patient) {
      res.status(404).json({ message: 'Patient profile not found.' })
      return
    }

    // Fetch records
    const records = await prisma.medicalRecord.findMany({
      where: { patientId: patient.id },
      orderBy: { date: 'desc' },
    })

    res.json({ records })
  } catch (error) {
    console.error('Error fetching records:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export const getPatientAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const patient = await prisma.patient.findUnique({
      where: { userId: String(id) },
    })

    if (!patient) {
      res.status(404).json({ message: 'Patient profile not found.' })
      return
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { date: 'asc' },
    })

    res.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
