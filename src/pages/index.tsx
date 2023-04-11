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
                    className={'text-[#8C2F00] hover:scale-110 h-20 w-20 transform transition duration-100 ' + (menuVisible ? 'rotate-90 ' : '')} />
            </div>
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
            <div id='home' >
                <div className='h-screen overflow-clip w-full bg-[#FF955F]' >
                    <div className='h-1/3 w-full top-0 bg-gray-500 '>
                        <div className='blur-sm h-full w-full'>
                            <Image
                                src='/workshop/dvelped_nice_pic_scaled.png'
                                alt='Picture of workshop'
                                style={{ objectFit: "cover" }}
                                priority
                                fill
                            />
                        </div>
                    </div>

                    <div className="w-full gap-4 grid sm:grid-flow-col grid-flow-row xl:px-20 xl:pl-40 ">
                        <div className="p-16 text-[#8C2F00] text-3xl">
                            <div>
                                <h1>
                                    Acting workshops with
                                    the UK&apos;s leading directors
                                </h1>
                                <div className="h-5" />
                                <Link
                                    className="px-5 py-3 bg-[#8C2F00] text-gray-100 font-bold rounded-full"
                                    href={'/apply'}>Apply</Link>
                            </div>
                            <div className='h-5' />
                            <div className="sm:pt-5" >
                                <div className='md:absolute bottom-16 left-16 lg:left-52'>
                                    atto supports
                                    <Image
                                        // className='float-right'
                                        alt='DFYC logo'
                                        src='/dfyc_logo.jpg'
                                        width={472}
                                        height={508}
                                        style={{
                                            width: '50%',
                                            // height: '25%',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="place-content-center w-full min-sm:py-16">
                            <Image
                                className='object-center'
                                alt="Atto logo"
                                width={1890 / 3}
                                height={1417 / 3}
                                src='/logo_with_name.png'
                            />
                        </div>
                    </div>
                </div>
            </div >
            <div id='workshops'>
                <div className='h-screen w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-white'>
                    <div className="p-10 container flex flex-col  text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                Workshops
                            </h1>
                            <div className="h-10" />
                        </div>
                    </div>
                </div>
            </div >
            <div id='what-we-do'>
                <div className='h-screen w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-[#FF955F]'>
                    <div className="p-10 container flex flex-col text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                What we do
                            </h1>
                        </div>
                    </div>
                </div>
            </div >
            <div id='testimonials'>
                <div className='h-screen w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-white'>
                    <div className="p-10 container flex flex-col  text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                Testimonials
                            </h1>
                        </div>
                    </div>
                </div>
            </div >
        </AttoPage >
    )
}

