import Image from 'next/image'
import Link from "next/link";
import AttoPage from "~/components/page";
import { GoKebabVertical } from 'react-icons/go'
import { useEffect, useState } from 'react';

function Menu() {
    const [menuVisible, setMenuVisible] = useState(false)

    useEffect(() => {
        console.log(menuVisible)
    }, [menuVisible])

    return (
        <>
            <div className='z-30 top-16 right-16  fixed '>
                <GoKebabVertical
                    onClick={() => setMenuVisible(!menuVisible)}
                    // color='rgb(227,180,65)'
                    // color='#e95c20'
                    className={'text-[#8C2F00] hover:scale-110 h-20 w-20 transform transition duration-100 ' + (menuVisible ? 'rotate-90 ' : '')} />
            </div>
            {/* <div className={'z-30 top-36 right-5  fixed  p-4 transition-transform duration-500  transform' + (menuVisible ? 'translate-x-0' : 'translate-x-full')}> */}
            <div
                className={`${menuVisible ? 'translate-x-0' : 'translate-x-full'
                    } transform fixed z-30 top-36 right-6 h-full w-64 p-4 transition-transform duration-500`}
            >
                {menuVisible && (
                    <nav className='bg-[#e95c20] rounded-lg shadow-lg grid text-white text-2xl z-40'>
                        <Link href={'/apply'} className='grid-cols-1  p-2 mr-4 '>
                            Apply
                        </Link>
                        <a
                            href='#workshops'
                            className='grid-cols-1  p-2 mr-4 '>
                            Workshops
                        </a>
                        <a
                            href='#what-we-do'
                            className='grid-cols-1  p-2 mr-4 '>
                            What we do
                        </a>
                        <a
                            href='#testimonials'
                            className='grid-cols-1  p-2 mr-4 '>
                            Testimonials
                        </a>
                        <Link href={'/contactme'} className='grid-cols-1  p-2 mr-4 '>
                            Contact us
                        </Link>
                    </nav>
                )}
            </div>
        </>
    )
}

export default function Home() {

    return (
        <AttoPage>
            <Menu />
            <section id='home'>
                <div className='z-0 h-1/3 blur-sm absolute -inset-1 '>
                    <Image
                        src='/workshop/dvelped_nice_pic.png'
                        alt='Picture of workshop'
                        style={{ objectFit: "cover" }}
                        fill
                    />
                </div>
                <div className='absolute h-screen w-screen -z-10  bg-[#FF955F]' />
                <div
                    // style={{ zIndex: 10 }}
                    className="z-10 h-screen w-screen grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 ">
                    <div className="relative p-20 container flex flex-col text-[#8C2F00] text-3xl">
                        <div className="pt-96 h-full ltr">
                            <h1>
                                Acting workshops with
                                the UK&apos;s leading directors
                            </h1>
                            <div className="h-10" />
                            <Link
                                className="px-5 py-3 bg-[#8C2F00] text-gray-100 font-bold rounded-full"
                                href={'/apply'}>Apply</Link>
                        </div>
                        <Link href={'/contactme'}>Contact me</Link>
                    </div>
                    <div className="container relative flex flex-col items-center justify-center gap-12 px-4 py-16">
                        <Image
                            alt="Atto logo"
                            width={1890 / 3}
                            height={1417 / 3}
                            src='/logo_with_name.png'
                        />
                    </div>
                </div>
            </section >
            <section id='workshops'>
                <div className='h-screen w-screen grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-white'>
                    <div className="p-10 container flex flex-col  text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                Workshops
                            </h1>
                            <div className="h-10" />
                        </div>
                    </div>
                </div>
            </section >
            <section id='what-we-do'>
                <div className='h-screen w-screen grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-[#FF955F]'>
                    <div className="p-10 container flex flex-col text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                What we do
                            </h1>
                        </div>
                    </div>
                </div>
            </section >
            <section id='testimonials'>
                <div className='h-screen w-screen grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-white'>
                    <div className="p-10 container flex flex-col  text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                Testimonials
                            </h1>
                        </div>
                    </div>
                </div>
            </section >
        </AttoPage >
    )
}

