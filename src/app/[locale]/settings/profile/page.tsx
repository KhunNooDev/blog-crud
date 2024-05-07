'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { object, string, custom } from 'zod'
import { RiSettings3Line } from 'react-icons/ri'
import axios from 'axios'

// Define Zod schema for form validation
const schema = object({
  name: string().min(2).max(50),
  // email: string().email(),
  // password: string().min(6),
  image: custom<File>(),
})

interface ProfileSettingsProps {}

export default function ProfileSettings(props: ProfileSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'John Doe',
      // email: 'johndoe@example.com',
      // password: '',
      image: null,
      // imagePreview: '',
    },
  })

  const [imagePreview, setImagePreview] = useState<string>('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0]
    if (selectedImage) {
      const reader = new FileReader()
      reader.onload = event => {
        if (event.target) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(selectedImage)
    }
  }

  const onSubmit = (data: any) => {
    // Send data to the server
    console.log('Profile updated:', data)
    axios.post('/api/settings/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  return (
    <div className='mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md'>
      <div className='mb-6 flex items-center'>
        <RiSettings3Line className='mr-2 text-3xl' />
        <h2 className='text-xl font-semibold'>Profile Settings</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label htmlFor='name' className='mb-1 block font-medium text-gray-700'>
            Name
          </label>
          <input
            type='text'
            id='name'
            className='w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none'
            {...register('name')}
          />
          {errors.name && <span className='text-red-500'>{errors.name.message}</span>}
        </div>
        {/* <div className='mb-4'>
          <label htmlFor='email' className='mb-1 block font-medium text-gray-700'>
            Email
          </label>
          <input
            type='email'
            id='email'
            className='w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none'
            {...register('email')}
          />
          {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='mb-1 block font-medium text-gray-700'>
            New Password
          </label>
          <input
            type='password'
            id='password'
            className='w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none'
            {...register('password')}
          />
          {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
        </div> */}
        <div className='mb-4'>
          <label htmlFor='image' className='mb-1 block font-medium text-gray-700'>
            Profile Image
          </label>
          <input
            type='file'
            id='image'
            accept='image/*'
            className='hidden'
            {...register('image')}
            onChange={e => {
              register('image').onChange(e)
              handleImageChange(e)
            }}
          />
          {errors.image && <span className='text-red-500'>{errors.image.message}</span>}

          <label htmlFor='image' className='cursor-pointer rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300'>
            Select Image
          </label>
          {imagePreview && (
            <div className='mt-2 rounded-md border border-gray-300'>
              <Image priority src={imagePreview} alt='Profile Preview' width={200} height={200} unoptimized={true} />
            </div>
          )}
        </div>
        <button
          type='submit'
          className='w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600'
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
