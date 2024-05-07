'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi'
import { Params } from '@/types/params'
import { getTranslationClient } from '@/i18n/client'
import { BlogsType } from '@/app/api/blogs/route'
import { cn } from '@/utils/cn'
import { RiArrowRightLine } from 'react-icons/ri'
import { Option } from '@/components/FormControls/types'
import moment from 'moment'
import useStateApi from '@/hooks/useStateApi'
import { BlogCategoriesType } from '@/app/api/blogCategories/route'

export default function BlogsPage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale, 'blogs')
  const router = useRouter()

  const [blogs, setBlogs] = useState<BlogsType>([])
  // const [categories, setCategories] = useState<Option[]>([])
  const [categories, loading, error] = useStateApi<Option[]>('/api/blogCategories', 'blogCategories')
  // if (categories) {
  //   debugger
  // }
  const [categoryId, setCategoryId] = useState<string | number | null>(null)

  useEffect(() => {
    document.title = t('title-web')
    // getBlogCategories()
  }, [])

  useEffect(() => {
    getBlogs()
  }, [categoryId])

  // const getBlogCategories = () =>
  //   axios
  //     .get('/api/blogCategories')
  //     .then(res => {
  //       setCategories(res.data.blogCategories)
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error)
  //     })

  const getBlogs = () =>
    axios
      .get('/api/blogs', {
        params: {
          categoryId,
        },
      })
      .then(res => {
        setBlogs(res.data.blogs)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })

  const deleteBlog = async (id: string) => {
    axios
      .delete(`/api/blogs/${id}`)
      .then(res => {
        getBlogs()
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }

  return (
    <main className='bg-base-200'>
      <div className='hero py-10'>
        <div className='hero-content'>
          <div className='flex max-w-lg flex-col items-center text-center'>
            <h1>Welcome to Our Blog</h1>
            <p className='py-6'>
              Delve into Our Blog: Uncover Fresh Perspectives, Inspiring Stories, and Expert Tips in Design and
              Development
            </p>
            <button onClick={() => router.push('/blogs/create')} className='btn btn-primary'>
              Create your blogs <RiArrowRightLine />
            </button>
          </div>
        </div>
      </div>
      <div className='bg-base-content py-4 text-base-200'>
        <div className='flex justify-center gap-5'>
          <div
            className={cn('link-hover link', { underline: categoryId === null })}
            onClick={() => setCategoryId(null)}
          >
            All
          </div>
          {categories?.map((category, idx) => (
            <div
              key={idx}
              className={cn('link-hover link', { underline: categoryId === category.value })}
              onClick={() => setCategoryId(category.value)}
            >
              {category.label}
            </div>
          ))}
        </div>
      </div>
      <div className='min-h-screen bg-base-200 py-10'>
        <div className='mx-24 '>
          <h1 className='my-6 text-3xl font-bold '>{t('list-blogs')}</h1>
          {blogs.length === 0 && <div>No blogs found</div>}
          <div className='gap-4 grid-responsive'>
            {blogs.map(blog => (
              <div key={blog.id} className='card bg-base-300 shadow-xl cols-responsive-4'>
                <article className='card-body'>
                  <div className='flex justify-between'>
                    <time>{moment(blog.updatedAt).format('MMM DD, YYYY')}</time>
                    <div className='flex items-center gap-2'>
                      <div className='badge badge-secondary'>{blog.createdBy.name}</div>
                      {blog.createdBy.name != blog.updatedBy.name && (
                        <div className='flex items-center gap-2'>
                          / <div className='badge badge-secondary'>{blog.updatedBy.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <h2 className='card-title line-clamp-1'>{blog.title}</h2>
                  <p className='line-clamp-3 lg:line-clamp-5'>{blog.content}</p>
                  <div className='flex items-center gap-2'>
                    {blog.blogCategories.map((category, idx) => (
                      <div key={idx} className='badge badge-primary'>
                        {category.blogCategory.name}
                      </div>
                    ))}
                  </div>
                  <div className='card-actions justify-between'>
                    <button
                      onClick={() => router.push(`/blogs/${blog.id}`)}
                      className='btn btn-square btn-ghost text-blue-500'
                    >
                      <FiEye />
                    </button>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => router.push(`/blogs/${blog.id}/edit`)}
                        className='btn btn-square btn-ghost'
                      >
                        <FiEdit />
                      </button>
                      <button onClick={() => deleteBlog(blog.id)} className='btn btn-square btn-ghost text-red-500'>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
