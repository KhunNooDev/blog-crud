'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Params } from '@/types/params'
import { getTranslationClient } from '@/i18n/client'
import Form, { Divider, InputGroup, InputMultiSelect, InputText, InputTextArea } from '@/components/FormControls/Form'
import axios from 'axios'

export default function BlogCreatePage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale, 'blogs')
  const router = useRouter()
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

  const onSubmit = (data: any) => {
    if (data.success) {
      alert('Blog created successfully')
      router.push(`/blogs/`)
      // router.push(`/blogs/${data.blog.id}`)
    } else {
      alert(data.error)
    }
  }

  return (
    <main className='container mx-auto min-h-screen'>
      <h1 className='my-6 text-3xl font-bold'>{t('create')}</h1>
      <Form onSubmit={onSubmit} action='/blogs' method='POST' vertical>
        <InputText id='title' label={t('form.title')} required />
        <InputTextArea id='content' label={t('form.content')} rows={10} required />
        {/* <Divider text={'Other'} /> */}
        <InputMultiSelect id='categoryIds' label={'Categories'} options={categories} required />
        <InputGroup>
          <button type='submit' className='btn btn-primary col-span-12 md:col-span-2'>
            {t('btn.save')}
          </button>
        </InputGroup>
      </Form>
    </main>
  )
}
