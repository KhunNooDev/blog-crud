'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
// import { ThemeProvider } from 'next-themes'
import { IconContext } from 'react-icons'
import { usePathname } from 'next/navigation'
import ChangeLocale from '@/components/ChangeLocale'
import Link from 'next/link'
import { LocaleTypes } from '@/i18n/settings'
import Navbar from '@/components/Navbar'

interface IProviders {
  children: React.ReactNode
  locale: LocaleTypes
}
const protectedPages = ['/sign-in', '/sign-up'] // Pages that require authentication

export default function Providers({ children, locale }: IProviders) {
  const pathname = usePathname()
  const pageName = pathname.split('/').slice(-1)[0]

  return (
    <SessionProvider>
      <IconContext.Provider value={{ /*color: 'blue',*/ className: 'react-icons' }}>
        {protectedPages.includes(`/${pageName}`) ? (
          <>{children}</>
        ) : (
          <>
            <Navbar locale={locale} />
            {children}
          </>
        )}
      </IconContext.Provider>
    </SessionProvider>
  )
}