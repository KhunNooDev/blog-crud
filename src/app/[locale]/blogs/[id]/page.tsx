'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Params } from '@/types/params'
import { Blogs } from '@prisma/client'
import { getTranslationClient } from '@/i18n/client'
import Form, { InputText, InputTextArea } from '@/components/FormControls/Form'

export default function BlogDetailsPage({ params }: Params) {
  const { locale, id } = params
  const { t } = getTranslationClient(locale, 'blogs')
  const router = useRouter()
  const [blog, setBlog] = useState<Blogs | null>(null)

  useEffect(() => {
    if (id) {
      getBlog(id)
    }
  }, [id])

  const getBlog = (id: string) =>
    axios
      .get(`/api/blogs/${id}`)
      .then(res => {
        const data = res.data
        setBlog(data.blog)
        document.title = `${t('title-web')} - ${data.blog.title}`
      })
      .catch(err => {
        //
      })

  return (
    blog && (
      <div className='mx-24'>
        <h1 className='my-6 text-3xl font-bold'>{t('list-detail')}</h1>
        <Form defaultValues={blog} vertical readOnly>
          <InputText id='title' label={t('form.title')} labelCol={3} required />
          <InputTextArea id='content' label={t('form.content')} labelCol={3} rows={5} required />
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
