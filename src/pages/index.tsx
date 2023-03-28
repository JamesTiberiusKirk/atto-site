import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'


export default function Home() {
    return (
        <>
            <Head>
                <title>Atto</title>
                <meta name="description" content="Atto Workshop" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* background: #e95c20   bg-amber-600*/}
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#e95c20]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    <div className="p-10 container flex flex-col text-emerald-700 text-3xl">
                        <div className="h-full ltr">
                            <h1>
                                Acting workshops with
                                the UK&apos;s leading directors
                            </h1>
                            <div className="h-10" />
                            <Link
                                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full"
                                href={'/apply'}>Apply to a workshop</Link>
                        </div>
                        <Link href={'/contactme'}>Contact me</Link>
                    </div>
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                        <Image
                            alt="Atto logo"
                            width={1890 / 3}
                            height={1417 / 3}
                            src='/logo.png'
                        />
                        <h1 className="text-6xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-100 to-emerald-600 sm:text-[5rem]">
                            <span className="">atto</span>
                        </h1>
                    </div>
                </div>
            </main>
        </>
    )
}

