import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create Users
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@hospital.com' },
    update: {},
    create: {
      email: 'doctor@hospital.com',
      name: 'Dr. Gregory House',
      password: hashedPassword,
      role: 'DOCTOR',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      name: 'Lisa Cuddy',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@hospital.com' },
    update: {},
    create: {
      email: 'patient@hospital.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'PATIENT',
    },
  })

  const patientUser2 = await prisma.user.upsert({
    where: { email: 'jane.smith@hospital.com' },
    update: {},
    create: {
      email: 'jane.smith@hospital.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'PATIENT',
    },
  })

  // 2. Create Patients
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'MRN001' },
    update: {},
    create: {
      userId: patientUser.id,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      mrn: 'MRN001',
      doctorId: doctor.id,
      status: 'ADMITTED'
    }
  })

  const patient2 = await prisma.patient.upsert({
    where: { mrn: 'MRN002' },
    update: {},
    create: {
      userId: patientUser2.id,
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      mrn: 'MRN002',
      doctorId: doctor.id,
      status: 'ADMITTED'
    }
  })

  // 3. Create Medical Records
  await prisma.medicalRecord.createMany({
    data: [
      {
        patientId: patient1.id,
        type: 'LAB',
        title: 'Complete Blood Count (CBC)',
        description: 'WBC 8.4, HGB 14.2, HCT 42.1, PLT 250. All values within normal limits.',
        date: new Date(Date.now() - 86400000 * 5) // 5 days ago
      },
      {
        patientId: patient1.id,
        type: 'IMAGING',
        title: 'Chest X-Ray',
        description: 'No acute cardiopulmonary process. Lungs are clear.',
        date: new Date(Date.now() - 86400000 * 3) // 3 days ago
      },
      {
        patientId: patient2.id,
        type: 'LAB',
        title: 'Comprehensive Metabolic Panel (CMP)',
        description: 'Glucose 95, BUN 15, Creatinine 0.8, Sodium 140, Potassium 4.2. Normal findings.',
        date: new Date(Date.now() - 86400000 * 2) // 2 days ago
      }
    ]
  })

  // 4. Create Appointments
  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: 'Cardiology',
        date: new Date(Date.now() + 86400000 * 7), // 7 days from now
        status: 'UPCOMING'
      },
      {
        patientId: patient1.id,
        doctorId: null,
        doctorName: 'Dr. James Wilson',
        department: 'Oncology',
        date: new Date(Date.now() + 86400000 * 14), // 14 days from now
        status: 'UPCOMING'
      },
      {
        patientId: patient2.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: 'General Practice',
        date: new Date(Date.now() + 86400000 * 2), // 2 days from now
        status: 'UPCOMING'
      }
    ]
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
