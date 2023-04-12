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
                <div className='min-h-screen  w-full bg-[#FF955F] bellow-xl:text-center bellow-xl:object-center' >
                    <div className='relative over-sm:h-64 bellow-sm:h-52 w-full top-0 bg-gray-500 '>
                        <div className='blur-sm h-full w-full'>
                            <Image
                                src='/workshop/dvelped_nice_pic_scaled.png'
                                alt='Picture of workshop'
                                // style={{ objectFit: "cover" }}
                                style={{ objectFit: 'cover' }}
                                priority
                                fill
                            />
                        </div>
                    </div>

                    <div className="w-full gap-4 grid over-xl:grid-flow-col bellow-xl:grid-flow-row over-xl:px-20 over-xl:pl-40 ">
                        <div className="bellow-sm:p-16 px-16 py-10 text-[#8C2F00] text-3xl">
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
                            <div className="bellow-xl:pt-5 bellow-xl:w-full bellow-xl:object-center " >
                                <div className='over-xl:absolute bottom-16 left-16 over-xl:left-52 '>
                                    atto supports
                                    <div
                                        className='max-w-sm mx-auto'>
                                        <Image
                                            className='mx-auto'
                                            alt='DFYC logo'
                                            src='/dfyc_logo.jpg'
                                            width={472}
                                            height={508}
                                            style={{
                                                width: '50%',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="place-content-center w-full over-xl:py-16">
                            <Image
                                className='object-center mx-auto'
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
                            <p>
                                What we do

                                Professional actors with professional directors

                                On Saturdays professional actors of all ages are welcome to take part in our drop-in scene studies. Our aim is to create a truly safe space to fail, succeed, learn & work on that craft with the guidance of leading directors.
                                Workshops will take place at Downside Fisher Youth Club, Coxson Place, Druid Street, London, SE1 2EZ. A 10 minute walk from London Bridge Station.

                                Workshops help support the running of the Downside Fisher Youth Club who help socially excluded children & young people from Bermondsey & its neighbouring areas.
                            </p>
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
                            <p>
                                Ayo - “I really loved the workshop because I learned something new that was very effective I will take with me for the rest of my acting career”

                                Ella Dorman-Gajic - “ An engaging and informative 2 hours, learning from a highly skilled director”

                                Atto Participant - “Great! Fun location and very inclusive”

                                Atto Participant - “ I liked that I didn’t feel pressure or nervous in the room, the director was friendly and communicative, easy to talk to and discuss where to go with the text”

                                Atto Participant - “I learnt about the importance of punctuation!”
                            </p>
                        </div>
                    </div>
                </div>
            </div >
            <div id='news-letter'>
                <div className='h-screen w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-white'>
                    <div className="p-10 container flex flex-col  text-[#8C2F00] text-3xl">
                        <div className="h-full ltr ">
                            <h1>
                                Subscribe to our news letter
                            </h1>
                        </div>
                    </div>
                </div>
            </div >
        </AttoPage >
    )
}

