'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Params } from '@/types/params'
import { Blogs } from '@prisma/client'
import { getTranslationClient } from '@/i18n/client'
import Form, { InputMultiSelect, InputText, InputTextArea } from '@/components/FormControls/Form'

export default function BlogDetailsPage({ params }: Params) {
  const { locale, id } = params
  const { t } = getTranslationClient(locale, 'blogs')
  const router = useRouter()
  const [blog, setBlog] = useState<Blogs | null>(null)

  useEffect(() => {
    document.title = `${t('title-web')}${blog && ` - ${blog.title}`}`
  }, [blog])

  useEffect(() => {
    getBlog()
  }, [])

  const getBlog = () =>
    axios
      .get(`/api/blogs/${id}`)
      .then(res => {
        const data = res.data
        setBlog(data.blog)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })

  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get('/api/blogCategories')
      .then(res => {
        setCategories(res.data.blogCategories)
      })
      .catch(error => {
        console.error('Error fetching categories:', error)
      })
  }, [])

  return (
    blog && (
      <div className='mx-24 min-h-screen'>
        <h1 className='my-6 text-3xl font-bold'>{t('list-detail')}</h1>
        <Form defaultValues={blog} vertical readOnly>
          <InputText id='title' label={t('form.title')} labelCol={3} required />
          <InputTextArea id='content' label={t('form.content')} labelCol={3} rows={10} required />
          <InputMultiSelect id='categoryIds' label={'Categories'} options={categories} required />
          <div className='mt-2 flex justify-between gap-2'>
            <button className='btn btn-primary w-28' onClick={() => router.push(`/blogs/${blog.id}/edit`)}>
              {t('btn.edit')}
            </button>
          </div>
        </Form>
      </div>
    )
  )
}
