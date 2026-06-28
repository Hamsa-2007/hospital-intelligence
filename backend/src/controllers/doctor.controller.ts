import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDoctorPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params // Doctor User ID

    const patients = await prisma.patient.findMany({
      where: { doctorId: String(id) },
      orderBy: { name: 'asc' },
    })

    res.json({ patients })
  } catch (error) {
    console.error('Error fetching doctor patients:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export const getDoctorSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params // Doctor User ID

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: String(id) },
      include: {
        patient: {
          select: { name: true, mrn: true, age: true }
        }
      },
      orderBy: { date: 'asc' },
    })

    res.json({ appointments })
  } catch (error) {
    console.error('Error fetching doctor schedule:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
