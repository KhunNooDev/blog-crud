import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'
import { authOptions } from '@/app/api/auth/options'
import { getServerSession } from 'next-auth'
import { parse } from 'url'

export type BlogsType = ReturnType<typeof GET> extends Promise<NextResponse<{ blogs: infer T }>> ? T : never
export type BlogType = ReturnType<typeof POST> extends Promise<NextResponse<{ blog: infer T }>> ? T : never

export async function GET(req: NextRequest) {
  const { query } = parse(req.url, true)
  const categoryId = query?.categoryId as string | undefined

  const blogs = await prisma.blogs.findMany({
    where: categoryId
      ? {
          blogCategories: {
            some: {
              blogCategoryId: categoryId,
            },
          },
        }
      : {},
    include: {
      blogCategories: {
        select: {
          blogCategory: {
            select: {
              name: true, // Include the name field of the blogCategory relation
            },
          },
        },
      },
      createdBy: {
        select: {
          name: true, // Include only the name field of the createdBy relation
        },
      },
      updatedBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
  })

  return NextResponse.json({
    success: true,
    blogs,
  })
}

export async function POST(req: NextRequest) {
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
  const createdBlog = await prisma.$transaction(async prisma => {
    const newBlog = await prisma.blogs.create({
      data: {
        title: blog.title,
        content: blog.content,
        createdById: userId,
        updatedById: userId,
      },
    })

    // Associate the blog with categories
    const categoryIds = blog.categoryIds
    const associations = await Promise.all(
      categoryIds.map(async (categoryId: string) => {
        return prisma.blogCategoryToBlog.create({
          data: {
            blogId: newBlog.id,
            blogCategoryId: categoryId,
          },
        })
      }),
    )
    return newBlog
  })

  return NextResponse.json({
    success: true,
    blog: createdBlog,
  })
}
