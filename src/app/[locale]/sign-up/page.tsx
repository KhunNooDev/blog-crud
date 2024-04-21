'use client'
import Form, { InputEmail, InputPass, InputText } from '@/components/FormControls/Form'
import { useRouter } from 'next/navigation'
import { getTranslationClient } from '@/i18n/client'
import { Params } from '@/types/params'
import Link from 'next/link'

export default function signUpPage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale)
  const router = useRouter()

  const onSubmit = (data: any) => {
    router.push('/sign-in')
  }
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Form onSubmit={onSubmit} action='/sign-up' method='POST' width='500px' vertical>
        <InputEmail id='email' label={t('sign-up.email')} required />
        <InputText id='name' label={t('sign-up.name')} required />
        <InputPass id='password' label={t('sign-up.password')} required />

        <div className='mt-2 flex flex-col gap-2'>
          <button type='submit' className='btn btn-primary'>
            {t('btn.sign-up')}
          </button>
        </div>
        <div className='mt-4 flex justify-center gap-2'>
          <span>{t('sign-up.msg')}</span>
          <Link href='/sign-in' className='text-blue-500'>
            {t('btn.sign-in')}
          </Link>
        </div>
      </Form>
    </div>
  )
}
