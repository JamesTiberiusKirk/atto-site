import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import AttoPage from '~/components/page';
import { api } from '~/utils/api';

import attoLogo from '/public/logo_with_name.png'
import dfycLogo from '/public/dfyc_logo_small.jpg'
import workshopBannerImage from '/public/workshop/dvelped_nice_pic_scaled.png'
import whatWeDoImage from '/public/workshop/dev_4.png'

function Menu() {
    const [menuVisible, setMenuVisible] = useState(false)

    return (
        <>
            <div className='z-30 top-10 right-10 fixed bg-[#f0631c] p-4 rounded-lg flex flex-row'>
                <AiOutlineTwitter
                    className='pr-2 text-white hover:scale-110 h-8 w-8 transform transition duration-100 '
                />
                <AiOutlineInstagram
                    className='pr-2 text-white hover:scale-110 h-8 w-8 transform transition duration-100 '
                />
                <RxHamburgerMenu
                    onClick={() => setMenuVisible(!menuVisible)}
                    className={'text-white hover:scale-110 h-8 w-8 transform transition duration-100 ' + (menuVisible ? 'rotate-90 ' : '')}
                />
            </div>
            <div
                className={`${menuVisible ? 'translate-x-0' : 'translate-x-full'
                    } transform fixed z-30 top-36 right-6 h-full w-64 p-4 transition-transform duration-500`}
            >
                {menuVisible && (
                    <nav className='bg-[#f0631c] rounded-lg shadow-lg grid text-white text-2xl z-40'>
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
                        <Link href={'/contactus'} className='grid-cols-1  p-2 mr-4 '>
                            Contact us
                        </Link>
                    </nav>
                )}
            </div>
        </>
    )
}

export default function Home() {
    const mutation = api.newsLetter.new.useMutation({
        onSuccess: () => {
            setEmail('')
        },
    })
    const [email, setEmail] = useState('')

    function handleSendForm(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        mutation.mutate(email);
    }

    const isFieldWrong = (fieldName: string): boolean => {
        if (!mutation.isError) return false
        return (mutation.error.data?.zodError?.fieldErrors[fieldName] !== undefined)
    }

    const getErrorMessages = (fieldName: string): string[] => {
        return mutation.error?.data?.zodError?.fieldErrors[fieldName] as string[]
    }

    return (
        <AttoPage>
            <Menu />
            <div id='home' >
                <div className='min-h-screen  w-full bg-[#FF955F] bellow-xl:text-center bellow-xl:object-center' >
                    <div className='relative over-sm:h-64 bellow-sm:h-52 w-full top-0 bg-gray-500 '>
                        <div className='h-full w-full'>
                            <Image
                                src={workshopBannerImage}
                                alt='Picture of workshop'
                                style={{ objectFit: 'cover' }}
                                priority
                                fill
                            />
                        </div>
                    </div>

                    <div className='w-full gap-4 grid over-xl:grid-flow-col bellow-xl:grid-flow-row over-xl:px-20 over-xl:pl-40 '>
                        <div className='bellow-sm:p-16 px-16 py-10 text-[#8C2F00] text-3xl'>
                            <div>
                                <h1>
                                    Acting workshops with
                                    the UK&apos;s leading directors
                                </h1>
                                <div className='h-5' />
                                <Link
                                    className='px-5 py-3 bg-[#8C2F00] text-gray-100 font-bold rounded-full'
                                    href={'/apply'}>Apply</Link>
                            </div>
                            <div className='h-5' />
                            <div className='bellow-xl:pt-5 bellow-xl:w-full bellow-xl:object-center bellow-nd:order-4 ' >
                                <div className='text-xl over-xl:absolute bottom-16 left-16 over-xl:left-52 '>
                                    atto supports
                                    <div
                                        className='max-w-sm mx-auto'>
                                        <Image
                                            className='mx-auto  '
                                            alt='DFYC logo'
                                            src={dfycLogo}
                                            style={{
                                                width: '50%',
                                            }}
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='place-content-center w-full over-xl:py-16'>
                            <Image
                                className='mx-auto bellow-xl:w-full bellow-xl:h-full over-xl:w-full'
                                alt='Atto logo'
                                src={attoLogo}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div >
            <div id='workshops'>
                <div className='min-h-screen w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 bg-white'>
                    <div className='p-10 container flex flex-col  text-t[#8C2F00] text-3xl'>
                        <div className='h-full ltr '>
                            <h1>
                                Workshops
                            </h1>
                            <div className='h-10' />
                        </div>
                    </div>
                </div>
            </div >
            <div id='what-we-do'>
                <div className='min-h-screen w-full bg-[#FF955F] text-[#8C2F00]'>
                    <div className='p-10 '>
                        <div className='my-auto'>
                            <h1 className='text-center text-3xl pb-5'>
                                What we do
                            </h1>
                            <div className='bg-white rounded-lg mx-auto flex flex-row bellow-lg:flex-col over-lg:max-w-5xl text-xl '>
                                <div
                                    className='w-full p-5 over-md:pr-10'
                                >
                                    <p className='py-2'>
                                        Professional actors with professional directors
                                    </p>
                                    <p className='py-2'>
                                        On Saturdays professional actors of all ages are welcome to take part in our drop-in scene studies. Our aim is to create a truly safe space to fail, succeed, learn & work on that craft with the guidance of leading directors.
                                    </p>
                                    <p className='py-2'>
                                        Workshops will take place at Downside Fisher Youth Club, Coxson Place, Druid Street, London, SE1 2EZ. A 10 minute walk from London Bridge Station.
                                    </p>
                                    <p className='py-2'>
                                        Workshops help support the running of the Downside Fisher Youth Club who help socially excluded children & young people from Bermondsey & its neighbouring areas.
                                    </p>
                                </div>
                                <div
                                    className='w-full'
                                >
                                    <Image
                                        src={whatWeDoImage}
                                        alt='Workshop picture'
                                        className='h-full w-full over-lg:rounded-r bellow-lg:rounded-b'
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div id='testimonials'>
                <div className='min-h-screen w-full bg-white text-[#8C2F00] '>
                    <div className='p-10 '>
                        <div className='h-full'>
                            <h1 className='text-3xl text-center mb-10'>
                                Testimonials
                            </h1>
                            <div className='over-lg:max-w-5xl mx-auto rounded-lg p-5 bg-[#FF955F] text-white text-xl mb-20'>
                                <div className='flex above-md:flex-row bellow-md:flex-col'>
                                    <div className='p-2'>
                                        <Image
                                            alt='Ayo'
                                            src='/workshop/ayo_small.png'
                                            width={816}
                                            height={642}
                                            className='rounded-lg'
                                        />
                                    </div>
                                    <div className='p-5 items-center justify-center my-auto'>
                                        “I really loved the workshop because I learned something new that was very effective I will take with me for the rest of my acting career”
                                        <p className='text-right'>
                                            - Ayo
                                        </p>
                                    </div>
                                </div>

                                <div className='flex above-md:flex-row bellow-md:flex-col '>
                                    <div className='p-5 items-center justify-center my-auto'>
                                        “An engaging and informative 2 hours, learning from a highly skilled director”
                                        <div className='text-right'>
                                            - Ella Dorman-Gajic
                                        </div>
                                    </div>
                                    <div className='p-2 bellow-md:order-first'>
                                        <Image
                                            alt='Ayo'
                                            src='/workshop/ella_small.png'
                                            width={892}
                                            height={664}
                                            className='rounded-lg '
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='over-lg:max-w-5xl mx-auto rounded-lg p-5 bg-[#FF955F] text-white text-xl'>
                            <div className='flex flex-row '>
                                <div className='py-10 max-w-lg mx-auto '>
                                    <p className='py-5 text-3xl text-center'>
                                        Other participants
                                    </p>
                                    <div className='py-5'>
                                        “Great! Fun location and very inclusive”
                                    </div>

                                    <div className='py-5'>
                                        “I liked that I didn’t feel pressure or nervous in the room, the director was friendly and communicative, easy to talk to and discuss where to go with the text”
                                    </div>

                                    <div className='py-5'>
                                        “I learnt about the importance of punctuation!”
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div id='news-letter' className=' w-full bg-[#FF955F]'>
                <div className='p-10 text-[#8C2F00]'>
                    <div className='h-full items-center flex flex-col'>
                        <h1 className='text-3xl text-center'>
                            Subscribe to our news letter
                        </h1>

                        <div className='max-w-xl w-full pb-2'>
                            <form className='mt-5 '>
                                <label className='pt-2 block text-gray-700 text-sm font-bold mb-2'>
                                    {mutation.isError && isFieldWrong('email') && (
                                        <span className='text-red-600'>* {getErrorMessages('email').map(s => s + ' ')}</span>
                                    )}
                                    <input className='shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                        value={email} name='email' type='text'
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={!mutation.isSuccess ? 'Email' : 'Thank you!'}
                                    />
                                </label>
                                <button type='submit' className='w-full  bg-[#8C2F00] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline'
                                    onClick={(e) => handleSendForm(e)} disabled={mutation.isLoading}>
                                    {mutation.isLoading ?
                                        (<div role='status'>
                                            <svg aria-hidden='true' role='status' className='inline w-4 h-4 mr-3 text-white animate-spin' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='#E5E7EB' />
                                                <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentColor' />
                                            </svg>
                                        </div>) :
                                        'Submit'
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AttoPage >
    )
}

