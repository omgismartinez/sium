import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Logo from './logo'
import { signOut, useSession } from 'next-auth/react'
import Skeleton from 'react-loading-skeleton'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState([''])
  const [mounted, setMounted] = useState(false)
  const { data, status } = useSession()

  const { asPath } = useRouter()

  const menu = [
    { name: 'Universidades', link: '/universidades' },
    { name: 'Carreras', link: '/carreras' },
    { name: 'Nosotros', link: '/nosotros' },
    { name: 'Administrador', link: '/admin', role: 'admin' },
  ]

  const renderHamburger = () => {
    return (
      <div className={`w-8 h-8 flex flex-col justify-center items-center md:hidden`} onClick={() => setIsOpen(!isOpen)}>
        <div className={`absolute w-5 h-0.5 transition-all duration-400 rounded-full ${isOpen ? 'bg-white rotate-45' : 'bg-black mb-[6px] ml-1'}`}></div>
        <div className={`absolute w-5 h-0.5 transition-all duration-400 rounded-full ${isOpen ? 'bg-white -rotate-45' : 'bg-black mt-[6px] mr-1'}`}></div>
      </div>
    )
  }

  useEffect(() => {
    if (data?.user?.name) setName(data?.user?.name.split(' '))
  }, [data])

  return (
    <nav className={`py-3 md:py-4 fixed inset-x-0 z-50 w-full transition-all ${isOpen ? 'text-white' : null}`}>
      <div className='flex flex-col max-w-[1280px] mx-auto px-4 md:px-8' onClick={() => isOpen ? setIsOpen(false) : null}>
        <div className='flex gap-10 text-xl justify-between md:justify-start items-center z-50 md:text-black font-bold h-8'>
          <Link href='/'>
            <a>
              <Logo className={'w-12 md:w-16'} fill={'#2524D1'} />
            </a>
          </Link>
          <div className='hidden md:flex w-full justify-between items-center text-font text-xs font-medium'>
            <div className='flex gap-5 lg:gap-8'>
              {menu.map((item, index) => (
                <Link key={index} href={item.link}>
                  <a className={`transition-colors hover:text-black ${item.link === asPath ? 'text-black' : null}`}>
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
            <div className='flex items-center gap-2'>
              {status === 'loading' ? (
                <Skeleton width={126} height={35} borderRadius={20} />
              ) : (
                <>
                  {data?.user?.name ? (
                    <div onMouseEnter={() => setMounted(true)} onMouseLeave={() => setMounted(false)} className='flex items-center gap-2 relative cursor-pointer'>
                      <h1 className='text-black font-bold'>{name[0]} {name[1] && name[1]?.charAt(0) + '.'}</h1>
                      <Image src={data?.user?.image!} alt={data?.user?.name!} width={35} height={35} className='rounded-full' />

                      <div onMouseEnter={() => setMounted(true)}
                        className={`absolute top-5 pt-5 right-0 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className='absolute top-4 right-2 rotate-45 border-8 border-white rounded-sm backdrop-blur-[4px]' />
                        <div className={`bg-white/95 backdrop-blur-sm rounded-md drop-shadow-2xl grid`}>
                          <span onClick={() => signOut()} className='block whitespace-nowrap hover:text-black px-5 py-2 transition-colors font-medium'>Cerrar sesión</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link href={'/login'}>
                      <a className='rounded-full bg-white/90 border backdrop-blur-sm hover:bg-white transition-colors p-2 md:px-3 md:py-2 text-black'>
                        Iniciar sesión
                      </a>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          {renderHamburger()}
        </div>
        <div className={`absolute z-40 inset-0 transition-transform py-6 px-1 duration-200 h-screen bg-black/95 ${isOpen ? null : 'translate-x-full'} pt-16 md:hidden`}>
          <div className='flex flex-col gap-1 font-semibold text-sm'>
            {menu.map((item, index) => (
              <Link key={index} href={item.link}>
                <a className='transition-colors cursor-pointer px-3 py-1 rounded-md hover:bg-black/80 text-white'>
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
