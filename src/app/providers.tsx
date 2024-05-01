'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { IconContext } from 'react-icons'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface IProviders {
  children: React.ReactNode
}

const protectedPages = ['/sign-in', '/sign-up'] // Pages that require authentication

export default function Providers({ children }: IProviders) {
  const pathname = usePathname()
  const pageName = pathname.split('/').slice(-1)[0]

  return (
    <SessionProvider>
      <IconContext.Provider value={{ /*color: 'blue',*/ className: 'react-icons' }}>
        {protectedPages.includes(`/${pageName}`) ? (
          <>{children}</>
        ) : (
          <>
            <Navbar />
            {children}
          </>
        )}
      </IconContext.Provider>
    </SessionProvider>
  )
}
