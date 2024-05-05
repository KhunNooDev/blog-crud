import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'
import { ParamsId } from '@/types/params'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/options'

export async function GET(req: NextRequest, { params }: ParamsId) {
  const { id } = params

  const blog = await prisma.$transaction(async prisma => {
    const blog = await prisma.blogs.findUnique({
      where: {
        id: id,
      },
      include: {
        blogCategories: {
          select: {
            blogCategoryId: true,
          },
        },
      },
    })

    if (!blog) {
      throw new Error('Blog not found')
    }

    const categoryIds = blog.blogCategories.map(blogCategoryToBlog => blogCategoryToBlog.blogCategoryId)
    // Destructure the 'blog' object, excluding the 'blogCategories' property
    const { blogCategories, ...rest } = blog // Remove the 'blogCategories' property

    // Create a new object 'customBlog' by spreading 'rest' and adding 'categoryIds'
    const customBlog = { ...rest, categoryIds } // Include 'categoryIds' in 'customBlog'

    return customBlog
  })

  // console.log(categoryIds)

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
  // const newBlog = await prisma.blogs.update({
  //   where: { id: id },
  //   data: {
  //     title: blog.title,
  //     content: blog.content,
  //     updatedById: userId,
  //     //updatedAt will auto update
  //   },
  // })
  // Start a transaction
  const updatedBlog = await prisma.$transaction(async prisma => {
    // Update the blog post details
    const updatedBlogPost = await prisma.blogs.update({
      where: { id: id },
      data: {
        title: blog.title,
        content: blog.content,
        updatedById: userId,
      },
      include: {
        blogCategories: true,
      },
    })

    // Delete existing associations between the blog post and categories
    await prisma.blogCategoryToBlog.deleteMany({
      where: {
        blogId: id,
      },
    })

    // Create new associations based on the updated category IDs
    const updatedCategories = await Promise.all(
      blog.categoryIds.map(async (categoryId: string) => {
        return prisma.blogCategoryToBlog.create({
          data: {
            blogId: id,
            blogCategoryId: categoryId,
          },
        })
      }),
    )

    return { ...updatedBlogPost, blogCategories: updatedCategories }
  })

  return NextResponse.json({
    success: true,
    data: updatedBlog,
  })
}

export async function DELETE(req: NextRequest, { params }: ParamsId) {
  const { id } = params

  // await prisma.blogs.delete({
  //   where: {
  //     id: id,
  //   },
  // })

  await prisma.$transaction([
    // Step 1: Delete associations in BlogCategoryToBlog table
    prisma.blogCategoryToBlog.deleteMany({
      where: {
        blogId: id,
      },
    }),
    // Step 2: Delete the blog
    prisma.blogs.delete({
      where: {
        id: id,
      },
    }),
  ])
  return NextResponse.json({ success: true })
}
