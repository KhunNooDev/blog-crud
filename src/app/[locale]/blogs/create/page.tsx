'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Params } from '@/types/params'
import { getTranslationClient } from '@/i18n/client'
import Form, { InputText, InputTextArea } from '@/components/FormControls/Form'

export default function BlogCreatePage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale, 'blogs')
  const router = useRouter()

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
    <main className='container mx-auto'>
      <h1 className='my-6 text-3xl font-bold'>{t('create')}</h1>
      <Form onSubmit={onSubmit} action='/blogs' method='POST' vertical>
        <InputText id='title' label={t('form.title')} labelCol={3} required />
        <InputTextArea id='content' label={t('form.content')} labelCol={3} rows={5} required />
        <div className='mt-2 flex flex-col gap-2'>
          <button type='submit' className='btn btn-primary'>
            {t('btn.save')}
          </button>
        </div>
      </Form>
    </main>
  )
}
