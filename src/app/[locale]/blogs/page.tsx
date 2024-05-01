'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi'
import { Params } from '@/types/params'
import { getTranslationClient } from '@/i18n/client'
import { BlogsType } from '@/app/api/blogs/route'
import { cn } from '@/utils/cn'

export default function BlogsPage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale, 'blogs')
  const router = useRouter()

  const [blogs, setBlogs] = useState<BlogsType>([])

  useEffect(() => {
    document.title = t('title-web')
    getBlogs()
  }, [])
  const getBlogs = async () => {
    axios
      .get('/api/blogs')
      .then(res => {
        setBlogs(res.data.blogs)
      })
      .catch(err => {
        //
      })
  }

  const deleteBlog = async (id: string) => {
    axios
      .delete(`/api/blogs/${id}`)
      .then(res => {
        getBlogs()
      })
      .catch(err => {
        //
      })
  }

  const [categoryId, setCategoryId] = useState(0)
  const categories = [
    'All',
    'Beanding',
    'Development',
    'Fireart Life',
    'Illustration',
    'Innovation Hub',
    'Motion Design',
    'UI/UX Design',
  ]
  return (
    <div className='mx-24'>
      <h1 className='my-6 text-3xl font-bold '>{t('list-blogs')}</h1>
      <div className='my-2 bg-base-200 p-4'>
        <div className='flex justify-center gap-2'>
          {categories.map((category, idx) => (
            <div
              className={cn('link-hover link', { underline: categoryId === idx })}
              onClick={() => setCategoryId(idx)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className='mb-4 flex items-center justify-between'>
        <button className='btn btn-primary' onClick={() => router.push('/blogs/create')}>
          {t('create')}
        </button>
      </div>
      {blogs.length === 0 && <div>No blogs found</div>}
      <div className='gap-4 grid-responsive'>
        {blogs.map(blog => (
          <div key={blog.id} className='card bg-base-200 shadow-xl cols-responsive-4'>
            <div className='card-body'>
              <h2 className='card-title'>{blog.title}</h2>
              <p>{blog.content}</p>
              <div className='mt-4 flex items-center gap-2'>
                <div className='badge badge-secondary'>{blog.createdBy.name}</div>
                {blog.createdBy.name != blog.updatedBy.name && (
                  <div className='flex items-center gap-2'>
                    / <div className='badge badge-secondary'>{blog.updatedBy.name}</div>
                  </div>
                )}
              </div>

              <div className='card-actions justify-between'>
                <button
                  onClick={() => router.push(`/blogs/${blog.id}`)}
                  className='btn btn-square btn-ghost text-blue-500'
                >
                  <FiEye />
                </button>
                <div className='flex gap-2'>
                  <button onClick={() => router.push(`/blogs/${blog.id}/edit`)} className='btn btn-square btn-ghost'>
                    <FiEdit />
                  </button>
                  <button onClick={() => deleteBlog(blog.id)} className='btn btn-square btn-ghost text-red-500'>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
