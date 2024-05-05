'use client'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import axios from 'axios'
import { z } from 'zod'
import {
  DividerProps,
  LayoutClasses,
  Option,
  PropsForm,
  PropsInputGroup,
  TypeInputCheckbox,
  TypeInputDefault,
  TypeInputSelect,
  TypeInputTextArea,
} from './types'
import { getTranslationClient } from '@/i18n/client'
import { LocaleTypes } from '@/i18n/settings'
import { FormContext } from './context'
import { cn } from '@/utils/cn'
import { RiArrowDownSLine, RiCloseFill } from 'react-icons/ri'

function getLayoutClasses(layout: string, labelCol?: number, inputCol?: number, noContainer?: boolean): LayoutClasses {
  const isHorizontal = layout === 'horizontal'
  const _labelCol = labelCol || (isHorizontal ? 3 : 12)
  const _inputCol = inputCol || (isHorizontal ? (noContainer ? 3 : 12 - _labelCol) : 12)
  const containerClass = isHorizontal ? 'items-center' : ''
  const labelClass = isHorizontal
    ? `col-span-${_labelCol} flex justify-start`
    : `block col-span-${_labelCol} text-start`
  const inputClass = isHorizontal
    ? `col-span-${_inputCol} ${noContainer ? '' : `${labelCol === 0 ? '' : `col-start-${_labelCol + 1}`}`}`
    : `col-span-${_inputCol}`

  return {
    isHorizontal: isHorizontal,
    labelCol: _labelCol,
    inputCol: _inputCol,
    containerClass: containerClass,
    labelClass: labelClass,
    inputClass: inputClass,
  }
}

export default function Form(props: PropsForm) {
  const {
    children,
    width = '100%',
    defaultValues,
    noSubmit,
    showReset,
    action,
    method,
    onSubmit,
    vertical,
    readOnly,
  } = props
  if ((action && !method) || (!action && method))
    throw new Error('Both action and method props must be provided or neither.')

  const locale = useParams()?.locale as LocaleTypes
  const { t } = getTranslationClient(locale)
  const methods = useForm<FormData>({
    defaultValues: defaultValues,
  })
  const { handleSubmit, reset } = methods
  const onSubmitFrom = (data: FormData) => {
    if (!action && !method && onSubmit) onSubmit(data)

    if (action) {
      axios({
        method,
        url: '/api' + action,
        data,
      })
        .then(response => {
          if (onSubmit) onSubmit(response.data)
          // console.log(response.data, data)
        })
        .catch(error => {
          console.error('An error occurred:', error)
        })
    }
  }

  return (
    <FormContext.Provider value={{ defaultLayout: vertical ? 'vertical' : 'horizontal', readOnly: !!readOnly }}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitFrom)}
          className='flex flex-col gap-4 p-2'
          style={{ width: width }}
          noValidate
        >
          {children}
          {/* {(!noSubmit || showReset) && (
            <div className='flex flex-col gap-2'>
              {!noSubmit && (
                <button
                  type='submit'
                  className='rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  {t('btn.submit')}
                </button>
              )}
              {showReset && (
                <button
                  type='button'
                  onClick={() => reset()}
                  className='rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                >
                  {t('btn.reset')}
                </button>
              )}
            </div>
          )} */}
        </form>
      </FormProvider>
    </FormContext.Provider>
  )
}

export function InputGroup(props: PropsInputGroup) {
  const { children } = props

  return <div className='mt-4 grid grid-cols-12 items-center gap-2'>{children}</div>
}

export function InputText(props: TypeInputDefault) {
  const { defaultLayout, readOnly } = useContext(FormContext)
  const {
    type = 'text',
    id,
    label,
    required,
    disabled = readOnly,
    layout = defaultLayout,
    labelCol,
    inputCol,
    max,
    min,
    noContainer,
    noLabel,
    placeholder,
  } = props
  const locale = useParams()?.locale as LocaleTypes
  const { t } = getTranslationClient(locale)
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const {
    isHorizontal,
    labelCol: _labelCol,
    inputCol: _inputCol,
    containerClass,
    labelClass,
    inputClass,
  }: LayoutClasses = getLayoutClasses(layout, labelCol, inputCol, noContainer)

  const validate = async (value: string) => {
    try {
      let schema
      switch (type) {
        case 'text':
          schema = z.string()
          break
        case 'number':
          schema = z.number()
          break
        case 'email':
          schema = z.string().email()
          break
        case 'password':
          schema = z.string()
          break
        default:
          throw new Error('Invalid input type')
      }
      if (min !== undefined) schema = schema.min(min)
      if (max !== undefined) schema = schema.max(max)

      if (type === 'number') {
        const parsedValue = parseFloat(value)
        await schema.parseAsync(parsedValue)
      } else {
        await schema.parseAsync(value)
      }
      return true
    } catch (error) {
      if (type === 'email') return t('errors.email_format')
      return error instanceof z.ZodError
        ? error.errors.map(err => t('errors.' + err.code, { err })).join(', ')
        : t('Invalid value')
    }
  }

  const element = (
    <>
      {!noLabel && (
        <label htmlFor={id} className={cn('label', labelClass)}>
          <span className='label-text flex gap-2'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </span>
        </label>
      )}

      <div className={`relative ${inputClass}`}>
        <input
          type={type}
          id={id}
          {...register(id, { required, validate, disabled })}
          placeholder={placeholder}
          className={cn('input input-bordered mb-1 w-full', {
            'border-red-500 focus:border-red-500': errors[id],
          })}
          autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
        />
        {errors[id] && (
          <div className={`col-start-4 ${inputClass}`}>
            <span className='absolute left-0 top-full text-nowrap text-xs font-medium text-red-500'>
              {(errors[id]?.message as string) || (errors[id]?.type === 'required' && t('errors.required'))}
            </span>
          </div>
        )}
      </div>
    </>
  )
  if (noContainer) {
    if (isHorizontal) return element
    return <div className={`col-span-${(noLabel ? _inputCol : _inputCol + _labelCol) || 6}`}>{element}</div>
  }
  return <div className={`grid grid-cols-12 ${containerClass}`}>{element}</div>
}

export function InputNum(props: TypeInputDefault) {
  const modifiedProps = {
    ...props,
    type: 'number' as const,
  }

  return <InputText {...modifiedProps} />
}

export function InputEmail(props: TypeInputDefault) {
  const modifiedProps = {
    ...props,
    type: 'email' as const,
  }

  return <InputText {...modifiedProps} />
}

export function InputPass(props: TypeInputDefault) {
  const modifiedProps = {
    ...props,
    type: 'password' as const,
  }

  return <InputText {...modifiedProps} />
}

export function InputTextArea(props: TypeInputTextArea) {
  const { defaultLayout, readOnly } = useContext(FormContext)
  const {
    type = 'text',
    id,
    label,
    required,
    disabled = readOnly,
    layout = defaultLayout,
    labelCol,
    inputCol,
    max,
    min,
    noContainer,
    noLabel,
    placeholder,
    rows,
  } = props
  const locale = useParams()?.locale as LocaleTypes
  const { t } = getTranslationClient(locale)
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const {
    isHorizontal,
    labelCol: _labelCol,
    inputCol: _inputCol,
    containerClass,
    labelClass,
    inputClass,
  }: LayoutClasses = getLayoutClasses(layout, labelCol, inputCol, noContainer)

  const validate = async (value: string) => {
    try {
      let schema
      switch (type) {
        case 'text':
          schema = z.string()
          break
        case 'number':
          schema = z.number()
          break
        case 'email':
          schema = z.string().email()
          break
        case 'password':
          schema = z.string()
          break
        default:
          throw new Error('Invalid input type')
      }
      if (min !== undefined) schema = schema.min(min)
      if (max !== undefined) schema = schema.max(max)

      if (type === 'number') {
        const parsedValue = parseFloat(value)
        await schema.parseAsync(parsedValue)
      } else {
        await schema.parseAsync(value)
      }
      return true
    } catch (error) {
      if (type === 'email') return t('errors.email_format')
      return error instanceof z.ZodError
        ? error.errors.map(err => t('errors.' + err.code, { err })).join(', ')
        : t('Invalid value')
    }
  }

  const element = (
    <>
      {!noLabel && (
        <label htmlFor={id} className={cn('label', labelClass)}>
          <span className='label-text flex gap-2'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </span>
        </label>
      )}

      <div className={`relative ${inputClass}`}>
        <textarea
          id={id}
          {...register(id, { required, validate, disabled })}
          className={cn('textarea textarea-bordered w-full', {
            'border-red-500 focus:border-red-500': errors[id],
          })}
          rows={rows}
          placeholder={placeholder}
        />
        {errors[id] && (
          <div className={`col-start-4 ${inputClass}`}>
            <span className='absolute left-0 top-full text-nowrap text-xs font-medium text-red-500'>
              {(errors[id]?.message as string) || (errors[id]?.type === 'required' && t('errors.required'))}
            </span>
          </div>
        )}
      </div>
    </>
  )
  if (noContainer) {
    if (isHorizontal) return element
    return <div className={`col-span-${(noLabel ? _inputCol : _inputCol + _labelCol) || 6}`}>{element}</div>
  }
  return <div className={`grid grid-cols-12 ${containerClass}`}>{element}</div>
}

export function InputCheckbox(props: TypeInputCheckbox) {
  const { defaultLayout, readOnly } = useContext(FormContext)
  const {
    id,
    label,
    labelContext,
    required,
    disabled = readOnly,
    layout = defaultLayout,
    labelCol,
    inputCol,
    noContainer,
    noLabel,
  } = props

  const locale = useParams()?.locale as LocaleTypes
  const { t } = getTranslationClient(locale)
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const {
    isHorizontal,
    labelCol: _labelCol,
    inputCol: _inputCol,
    containerClass,
    labelClass,
    inputClass,
  }: LayoutClasses = getLayoutClasses(layout, labelCol, inputCol, noContainer)

  const element = (
    <>
      {!noLabel && <span className={`text-gray-900 ${labelClass}`}>{label}</span>}
      <div className={`${inputClass} relative flex items-center gap-2`}>
        <input
          type='checkbox'
          id={id}
          {...register(id, { required, disabled })}
          className={`form-checkbox h-6 w-6 cursor-pointer rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:outline-none
          focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus-visible:border-indigo-300 focus-visible:ring ${
            errors[id] ? 'border-red-500' : ''
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        />
        {labelContext && (
          <label htmlFor={id} className='text-gray-900'>
            {labelContext}
          </label>
        )}
        {errors[id] && (
          <div className={`col-start-4 ${inputClass}`}>
            <span className='absolute left-0 top-full text-nowrap text-xs font-medium text-red-500'>
              {(errors[id]?.message as string) || (errors[id]?.type === 'required' && t('errors.required'))}
            </span>
          </div>
        )}
      </div>
    </>
  )

  if (noContainer) {
    if (isHorizontal) return element
    return <div className={`col-span-${(noLabel ? _inputCol : _inputCol + _labelCol) || 6}`}>{element}</div>
  }
  return <div className={`grid grid-cols-12 ${containerClass}`}>{element}</div>
}

export function InputSelect(props: TypeInputSelect) {
  const { defaultLayout, readOnly } = useContext(FormContext)
  const {
    id,
    label,
    options,
    required,
    disabled = readOnly,
    layout = defaultLayout,
    labelCol,
    inputCol,
    noContainer,
    noLabel,
    value,
    onChange,
  } = props

  const locale = useParams()?.locale as LocaleTypes
  const { t } = getTranslationClient(locale)
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const {
    isHorizontal,
    labelCol: _labelCol,
    inputCol: _inputCol,
    containerClass,
    labelClass,
    inputClass,
  }: LayoutClasses = getLayoutClasses(layout, labelCol, inputCol, noContainer)

  const element = (
    <>
      {!noLabel && (
        <label htmlFor={id} className={`text-gray-900 ${labelClass}`}>
          {label}
        </label>
      )}
      <div className={`relative ${inputClass}`}>
        <select
          id={id}
          {...register(id, { required, disabled })}
          className={`form-input mt-1 block w-full rounded-md border border-gray-300 p-1 text-gray-900 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200
          focus:ring-opacity-50 focus-visible:border-indigo-300 focus-visible:ring dark:text-gray-100 ${
            errors[id] ? 'border-red-500' : ''
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          onChange={onChange}
          value={value}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors[id] && (
          <div className={`col-start-4 ${inputClass}`}>
            <span className='absolute left-0 top-full text-nowrap text-xs font-medium text-red-500'>
              {(errors[id]?.message as string) || (errors[id]?.type === 'required' && t('errors.required'))}
            </span>
          </div>
        )}
      </div>
    </>
  )

  if (noContainer) {
    if (isHorizontal) return element
    return <div className={`col-span-${(noLabel ? _inputCol : _inputCol + _labelCol) || 6}`}>{element}</div>
  }
  return <div className={`mb-4 grid grid-cols-12 ${containerClass}`}>{element}</div>
}

export function InputMultiSelect(props: TypeInputSelect) {
  const { defaultLayout, readOnly } = useContext(FormContext)
  const {
    type = 'text',
    id,
    label,
    options,
    required,
    disabled = readOnly,
    layout = defaultLayout,
    labelCol,
    inputCol,
    max,
    min,
    noContainer,
    noLabel,
    placeholder,
    showClear,
  } = props
  const locale = useParams()?.locale as LocaleTypes
  const { t } = getTranslationClient(locale)
  const {
    register, //custom register
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useFormContext()
  const {
    isHorizontal,
    labelCol: _labelCol,
    inputCol: _inputCol,
    containerClass,
    labelClass,
    inputClass,
  }: LayoutClasses = getLayoutClasses(layout, labelCol, inputCol, noContainer)

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below')

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const inputRect = dropdownRef.current?.getBoundingClientRect()
    if (inputRect) {
      const spaceBelow = window.innerHeight - inputRect.bottom
      const spaceAbove = inputRect.top
      // Adjust threshold as needed
      const threshold = 200

      if (spaceBelow < threshold && spaceAbove > spaceBelow) {
        setDropdownPosition('above')
      } else {
        setDropdownPosition('below')
      }
    }
  }, [isDropdownOpen, dropdownRef])

  const dropdownClassName = cn('absolute left-0 z-40 max-h-80 w-full overflow-y-auto rounded bg-base-200 shadow', {
    'top-full': dropdownPosition === 'below',
    'bottom-full': dropdownPosition === 'above',
  })

  //{...register(id, { required, disabled })} for custom input
  useEffect(() => {
    const defaultValue = watch(id)
    if (defaultValue) {
      const selectedValues = options.filter(option => defaultValue.includes(option.value))
      setSelectedOptions(selectedValues)
    }
  }, [])

  const updateData = (options: Option[]) => {
    // Update form data when selectedOptions change
    setSelectedOptions(options)
    const selectedValues = options.map(option => option.value)
    // Check if field is required and selectedValues is empty
    if (required && (!selectedValues || selectedValues.length === 0)) {
      setError(id, { type: 'required', message: 'This field is required' })
    } else {
      clearErrors(id)
    }
    setValue(id, selectedValues)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleOptionClick = (option: Option) => {
    if (!selectedOptions.some(selected => selected.value === option.value)) {
      updateData([...selectedOptions, option])
      // onChange([...selectedOptions, option])
    }
    setSearchValue('')
    setIsDropdownOpen(false)
  }

  const handleRemoveOption = (option: Option) => {
    const updatedOptions = selectedOptions.filter(selected => selected.value !== option.value)
    updateData(updatedOptions)
    // onChange(updatedOptions)
  }

  const element = (
    <>
      {!noLabel && (
        <label htmlFor={id} className={cn('label', labelClass)}>
          <span className='label-text flex gap-2'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </span>
        </label>
      )}
      <div ref={dropdownRef} className={`relative ${inputClass}`}>
        <div
          className={cn('input input-bordered mb-1 flex w-full flex-wrap items-center gap-1', {
            'border-red-500 focus:border-red-500': errors[id],
            'input-disabled': disabled,
          })}
        >
          {selectedOptions.map(option => (
            <div key={option.value} className='badge badge-neutral flex items-center'>
              <div className='max-w-full flex-initial text-xs font-normal leading-none'>{option.label}</div>
              {!disabled && (
                <div>
                  <button className='ml-1 h-4 w-4 cursor-pointer' onClick={() => handleRemoveOption(option)}>
                    <RiCloseFill />
                  </button>
                </div>
              )}
            </div>
          ))}
          <input
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            onFocus={toggleDropdown}
            className={cn('input-transparent', {
              'input-disabled': disabled,
            })}
            disabled={disabled}
          />
          <div>
            {showClear && selectedOptions.length > 0 && !disabled && (
              <button className='h-4 w-4 cursor-pointer' onClick={() => setSelectedOptions([])}>
                <RiCloseFill />
              </button>
            )}
            <RiArrowDownSLine className='cursor-pointer opacity-70' onClick={toggleDropdown} />
          </div>
        </div>
        {errors[id] && (
          <div className={`col-start-4 ${inputClass}`}>
            <span className='absolute left-0 top-full text-nowrap text-xs font-medium text-red-500'>
              {(errors[id]?.message as string) || (errors[id]?.type === 'required' && t('errors.required'))}
            </span>
          </div>
        )}
        {isDropdownOpen && (
          <div className={dropdownClassName}>
            {options
              .filter(option => !selectedOptions.some(selected => selected.value === option.value))
              .filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase()))
              .map(option => (
                <div
                  key={option.value}
                  className='cursor-pointer border-b border-base-300 hover:opacity-60'
                  onClick={() => handleOptionClick(option)}
                >
                  <div className='flex items-center border-l-2 border-transparent p-2 pl-2 hover:border-base-100'>
                    <div className='mx-2 leading-6'>{option.label}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  )
  if (noContainer) {
    if (isHorizontal) return element
    return <div className={`col-span-${(noLabel ? _inputCol : _inputCol + _labelCol) || 6}`}>{element}</div>
  }
  return <div className={`grid grid-cols-12 ${containerClass}`}>{element}</div>
}
export function Divider({ text, isHorizontal }: DividerProps) {
  return <div className={cn('divider', { 'divider-horizontal': isHorizontal })}>{text}</div>
}
