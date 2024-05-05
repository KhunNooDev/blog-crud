'use client'
import { cn } from '@/utils/cn'
import React from 'react'
import Button from './Button'
import { signOut, useSession } from 'next-auth/react'
import { RiLogoutBoxLine } from 'react-icons/ri'
import Link from 'next/link'

export default function Avatar() {
  const { data: session } = useSession()

  const isOnline = true

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/sign-in' })
  }
  return (
    <div className='dropdown dropdown-end'>
      <div tabIndex={0} className={cn('avatar placeholder', { online: isOnline, offline: !isOnline })}>
        <div className='w-10 rounded-full bg-neutral text-neutral-content'>
          <span className='text-xl'>{getAvatarPlaceholder(session?.user.name as string)}</span>
        </div>
      </div>
      <ul tabIndex={0} className='menu dropdown-content z-[1] mt-4 w-52 rounded-box bg-base-100 p-2 shadow'>
        <li>
          <div className='flex flex-col items-start'>
            <div>{session?.user.name}</div>
            <div>{session?.user.email}</div>
          </div>
        </li>
        <li>
          <Link href={'#'}>Settings</Link>
        </li>
        <li>
          <div onClick={() => handleSignOut()} className={cn({ 'text-error': session, 'text-accent': !session })}>
            <RiLogoutBoxLine /> {session ? 'Sign Out' : 'Sign In'}
          </div>
        </li>
      </ul>
    </div>
  )
}

export function getAvatarPlaceholder(name?: string): string {
  const firstChar = name?.charAt(0) || ''
  return firstChar.toUpperCase()
}
