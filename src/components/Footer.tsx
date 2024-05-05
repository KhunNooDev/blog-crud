import { RiFacebookFill, RiTwitterFill, RiInstagramFill } from 'react-icons/ri'

export default function Footer() {
  return (
    <footer className='footer footer-center bg-base-300 py-5 text-base-content'>
      <div className='flex justify-center space-x-4'>
        <a href='#' className='text-xl text-gray-700 hover:text-blue-500'>
          <RiFacebookFill />
        </a>
        <a href='#' className='text-xl text-gray-700 hover:text-blue-500'>
          <RiTwitterFill />
        </a>
        <a href='#' className='text-xl text-gray-700 hover:text-blue-500'>
          <RiInstagramFill />
        </a>
      </div>
      <aside>
        <p>Copyright © 2024</p>
      </aside>
    </footer>
  )
}
