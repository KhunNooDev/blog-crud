import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'
import { authOptions } from '@/app/api/auth/options'
import { getServerSession } from 'next-auth'

export type BlogsType = ReturnType<typeof GET> extends Promise<NextResponse<{ blogs: infer T }>> ? T : never
export type BlogType = ReturnType<typeof POST> extends Promise<NextResponse<{ blog: infer T }>> ? T : never

export async function GET(req: NextRequest) {
  // const blogCategories = await prisma.blogCategories.findMany({})
  // select value: id, label: name
  const blogCategories = await prisma.blogCategories.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
  })

  const formattedCategories = blogCategories.map(category => ({
    value: category.id,
    label: category.name,
  }))
  return NextResponse.json({
    success: true,
    blogCategories: formattedCategories,
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({
      success: false,
      error: 'You are not logged in',
    })
  }
  const userId = session.user?.id
  const body = await req.json()

  const name = body.name
  // const categoryNames = ['Branding', 'Development', 'UI/UX Design']
  // const createdCategories = await Promise.all(
  //   categoryNames.map(async name => {
  //     return
  prisma.blogCategories.create({
    data: {
      name,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    },
  })
  // }),
  // )

  return NextResponse.json({
    success: true,
  })
}
