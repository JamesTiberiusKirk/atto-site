import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import AttoPage from "~/components/page";

export default function Confirmation() {
    const router = useRouter()
    const t = router.query['t']

    const content = `Thank you for your ${t === 'appl' ? 'application' : 'message'} to `

    return (
        <AttoPage>
            <div className="text-center min-h-screen px-4 py-16  bg-[#FF955F] ">
                <h1 className="text-5xl bellow-sm:text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    {content}
                    <br />
                    <span className="text-6xl bellow-sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-100 to-emerald-600 sm:text-[5rem]">
                        atto {' '}
                    </span>
                    workshops
                </h1>
                <div className='pt-32 place-content-center w-full over-xl:py-16'>
                    <Link href='/'>
                        <Image
                            className='object-center mx-auto'
                            alt='Atto logo'
                            width={1890 / 3}
                            height={1417 / 3}
                            src='/logo_with_name.png'
                        />
                    </Link>
                </div>
            </div>
        </AttoPage>
    )
}
