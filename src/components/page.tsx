import Head from "next/head"



type AttoPageProps = {
    children: React.ReactNode
}

export default function AttoPage({ children }: AttoPageProps) {
    return (
        <>
            <Head>
                <title>atto </title>
                < meta name="description" content="atto" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col items-center justify-center " >
                {children}
            </main >
        </>
    )
}
