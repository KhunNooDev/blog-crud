// export type FormData = {
//   [key: string]: string
// }

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export type PropsForm = {
  children: React.ReactNode
  width?: string
  defaultValues?: Record<string, any>
  noSubmit?: boolean
  showReset?: boolean
  action?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  onSubmit?: (data: any) => void
  vertical?: boolean
  readOnly?: boolean
}

export type PropsInputGroup = {
  children: React.ReactNode
}

export type TypeInputDefault<T = HTMLInputElement> = {
  label?: string
  id: string
  labelCol?: number
  inputCol?: number
  layout?: 'vertical' | 'horizontal'
  min?: number
  max?: number
  noContainer?: boolean
  noLabel?: boolean
} & InputHTMLAttributes<T>

export type TypeInputTextArea<T = HTMLInputElement> = {
  //
} & TypeInputDefault<T> &
  TextareaHTMLAttributes<T>

export type TypeInputCheckbox<T = HTMLInputElement> = {
  labelContext?: string
} & TypeInputDefault<T>

export type TypeInputSelect<T = HTMLSelectElement> = {
  options: Option[]
} & TypeInputDefault<T>

export type LayoutClasses = {
  isHorizontal: boolean
  labelCol: number
  inputCol: number
  containerClass: string
  labelClass: string
  inputClass: string
}

export type Option = {
  value: string | number
  label: string
}

export type DividerProps = {
  text?: string
  isHorizontal?: boolean
}
