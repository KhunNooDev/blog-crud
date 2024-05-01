'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Params } from '@/types/params'
import { getTranslationClient } from '@/i18n/client'
import Form, { Divider, InputGroup, InputMultiSelect, InputText, InputTextArea } from '@/components/FormControls/Form'

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

  const options = ['Option 1', 'Option 2', 'Option 3']

  return (
    <main className='container mx-auto'>
      <h1 className='my-6 text-3xl font-bold'>{t('create')}</h1>
      <Form onSubmit={onSubmit} action='/blogs' method='POST' vertical>
        <InputText id='title' label={t('form.title')} labelCol={3} required />
        <InputTextArea id='content' label={t('form.content')} labelCol={3} rows={5} required />
        <Divider text={'Other'} />
        <InputMultiSelect options={options} placeholder='Search...' />

        <InputGroup>
          <button type='submit' className='btn btn-primary col-span-12 md:col-span-2'>
            {t('btn.save')}
          </button>
        </InputGroup>
      </Form>
    </main>
  )
}
