import { Head } from "next/document"


type AttoPageProps = {
    title?: string
    children: React.ReactNode
}

export function AttoPage({ title, children }: AttoPageProps) {
    return (
        <>
            <Head>
                <title>
                    {title ? title : 'atto'}
                </title>
                <meta name="description" content="atto" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#e95c20]">
                {children}
            </main>
        </>
    )
}
