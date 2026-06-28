import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getStaffDirectory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all users who are DOCTOR or ADMIN
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['DOCTOR', 'ADMIN'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { role: 'desc' }
    })

    res.json({ staff })
  } catch (error) {
    console.error('Error fetching staff directory:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
