'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Params } from '@/types/params'
import { cn } from '@/utils/cn'
import { getTranslationClient } from '@/i18n/client'

export default function HomePage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale, 'home')

  useEffect(() => {
    document.title = `${t('title-web')}`
  }, [t])

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-base-300 py-12'>
      <h1 className='mb-4 text-3xl font-bold'>{t('text')}</h1>
      <p className='mb-8 text-lg'>{t('sub-text')}</p>
      <div className='flex flex-col gap-2'>
        <Link href='/blogs' className='btn btn-neutral'>
          {t('view')}
        </Link>
      </div>
    </main>
  )
}
