import Head from "next/head"



type AttoPageProps = {
    children: React.ReactNode
}

export default function AttoPage({ children }: AttoPageProps) {
    return (
        <>
            <Head>
                <title>atto </title>
                <meta name="description" content="atto" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@attoworkshops" />
                <meta name="twitter:title" content="atto workshops" />
                <meta name="twitter:description" content="Checkout and apply to atto workshops." />
                <meta name="twitter:image" content="/logo.png" />
            </Head>
            <main>
                {children}
            </main >
        </>
    )
}
