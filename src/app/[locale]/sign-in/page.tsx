'use client'
import Form, { InputEmail, InputPass } from '@/components/FormControls/Form'
import { Params } from '@/types/params'
import { getTranslationClient } from '@/i18n/client'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function signInPage({ params: { locale } }: Params) {
  const { t } = getTranslationClient(locale)
  const router = useRouter()

  const onSubmit = (data: any) => {
    signIn('credentials', {
      ...data,
      redirect: false,
    }).then(callback => {
      // debugger
      if (callback?.ok) {
        // router.refresh()
        router.push('/')
      }
      if (callback?.error) {
      }
    })
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Form onSubmit={onSubmit} width='500px' vertical>
        <InputEmail id='email' label={t('sign-in.email')} required />
        <InputPass id='password' label={t('sign-in.password')} required />
        {/* <div className='mb-4'>
          <Link href='/forgetpassword' className='block text-blue-500'>
            Forgot Password?
          </Link>
        </div> */}
        <div className='mt-2 flex flex-col gap-2'>
          <button type='submit' className='btn btn-primary'>
            {t('btn.sign-in')}
          </button>
        </div>
        <div className='mt-4 flex justify-center gap-2'>
          <span>{t('sign-in.msg')}</span>
          <Link href='/sign-up' className='text-blue-500'>
            {t('btn.sign-up')}
          </Link>
        </div>
      </Form>
    </div>
  )
}
