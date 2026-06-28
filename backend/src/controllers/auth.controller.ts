import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key'

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by auth middleware
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.userId },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
