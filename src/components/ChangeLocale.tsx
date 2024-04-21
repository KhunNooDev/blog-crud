'use client'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { LocaleTypes } from '@/i18n/settings'

interface IChangeLocale {
  locale: LocaleTypes
}
export default function ChangeLocale(props: IChangeLocale) {
  const { locale } = props
  const router = useRouter()
  const urlSegments = useSelectedLayoutSegments()

  const handleLocaleChange = (newLocale: LocaleTypes) => {
    // This is used by the Header component which is used in `app/[locale]/layout.tsx` file,
    // urlSegments will contain the segments after the locale.
    // We replace the URL with the new locale and the rest of the segments.
    router.push(`/${newLocale}/${urlSegments.join('/')}`)
  }
  return (
    <button className='flex items-center' onClick={() => handleLocaleChange(locale === 'en' ? 'th' : 'en')}>
      {locale === 'en' ? 'TH' : 'EN'}
    </button>
  )
}
