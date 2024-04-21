import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'
import { ParamsId } from '@/types/params'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/options'

export async function GET(req: NextRequest, { params }: ParamsId) {
  const { id } = params

  const blog = await prisma.blogs.findUnique({
    where: {
      id: id,
    },
  })

  return NextResponse.json({
    success: true,
    blog,
  })
}

//for edit
export async function PUT(req: NextRequest, { params }: ParamsId) {
  const { id } = params
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({
      success: false,
      blog: null,
      error: 'You are not logged in',
    })
  }
  const userId = session.user?.id

  const blog = await req.json()
  const newBlog = await prisma.blogs.update({
    where: { id: id },
    data: {
      title: blog.title,
      content: blog.content,
      updatedById: userId,
      //updatedAt will auto update
    },
  })
  return NextResponse.json({
    success: true,
    data: newBlog,
  })
}

export async function DELETE(req: NextRequest, { params }: ParamsId) {
  const { id } = params

  await prisma.blogs.delete({
    where: {
      id: id,
    },
  })
  return NextResponse.json({ success: true })
}
