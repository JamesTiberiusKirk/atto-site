import AttoPage from "~/components/page";

export default function Confirmation() {
    return (
        <>
            <AttoPage>
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Thank you for your application to {' '}
                        <span className="text-6xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-100 to-emerald-600 sm:text-[5rem]">
                            atto
                        </span>
                        workshops
                    </h1>
                </div>
            </AttoPage>
        </>
    )
}
