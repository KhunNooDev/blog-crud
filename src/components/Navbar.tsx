'use client'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { RiMenu2Line, RiMoonLine, RiSunLine } from 'react-icons/ri'
import { LocaleTypes } from '@/i18n/settings'
import ChangeLocale from './ChangeLocale'
import Avatar from './Avatar'

const titleHeader = 'BlogCRUD'
const menus = [
  {
    label: 'Blogs',
    href: '/blogs',
  },
  {
    label: 'Parent',
    href: '/',
    submenus: [
      {
        label: 'Submenu 1',
        href: '/',
      },
      {
        label: 'Submenu 2',
        href: '/',
      },
    ],
  },
  {
    label: 'Item 1',
    href: '/',
  },
]

interface INavbar {}
export default function Navbar(props: INavbar) {
  return (
    <div className='navbar bg-base-300'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <div>
              <RiMenu2Line size={18} />
            </div>
          </div>
          <ul tabIndex={0} className='menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow'>
            {menus.map((menu, index) => (
              <li key={index}>
                <Link href={menu.href}>{menu.label}</Link>
                {menu.submenus && (
                  <ul className='p-2'>
                    {menu.submenus.map((submenu, subIndex) => (
                      <li key={subIndex}>
                        <Link href={submenu.href}>{submenu.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Link href={'/'} className='btn btn-ghost text-xl'>
          {titleHeader}
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          {menus.map((menuItem, index) => (
            <Fragment key={index}>
              {menuItem.submenus ? (
                <li>
                  <details>
                    <summary>{menuItem.label}</summary>
                    <ul className='p-2'>
                      {menuItem.submenus.map((submenu, subIndex) => (
                        <li key={subIndex}>
                          <Link href={submenu.href}>{submenu.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li>
                  <Link href={menuItem.href}>{menuItem.label}</Link>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
      <div className='navbar-end gap-4 px-4'>
        <label className='!swap swap-rotate'>
          <input type='checkbox' className='theme-controller hidden' value='light' />
          <RiSunLine className='swap-off fill-current' size={20} />
          <RiMoonLine className='swap-on fill-current' size={20} />
        </label>
        <ChangeLocale />
        <Avatar />
      </div>
    </div>
  )
}
