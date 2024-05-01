'use client'

import { cn } from '@/utils/cn'
import { ButtonHTMLAttributes } from 'react'

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {}
export default function Button(props: IButton) {
  const { children, type, onClick, className } = props
  return (
    <button type={type || 'button'} onClick={onClick} className={cn(className, 'btn')}>
      {children}
    </button>
  )
}
