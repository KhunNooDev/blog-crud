import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const user = await req.json()

  const hashedPassword = await bcrypt.hash(user.password, 12)

  const newUser = await prisma.users.create({
    data: {
      email: user.email.toLowerCase(),
      name: user.name,
      hashedPassword,
    },
  })
  console.log(newUser)

  return NextResponse.json({
    success: true,
    user: newUser,
  })
}
