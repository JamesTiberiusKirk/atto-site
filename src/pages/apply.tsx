import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

// TODO: need to handle input validation here
export default function Apply() {
    const mutation = api.apply.new.useMutation()

    const workshopOptions = [
        {
            display: 'Workshop a',
            name: 'workshop_a',
        },
        {
            display: 'Workshop b',
            name: 'workshop_b',
        },
        {
            display: 'Workshop c',
            name: 'workshop_c',
        },
    ]

    const [name, setName] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [email, setEmail] = useState('')
    const [workshop, setWorkshop] = useState('')
    const [credits, setCredits] = useState('')
    const [emailPreference, setEmailPreference] = useState(false)


    const handleSendForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log('handle send form')
        mutation.mutate({
            name,
            email,
            pronouns,
            workshop,
            credits,
            emailPreference,
        })
    }

    return (
        <>
            <Head>
                <title>atto</title>
                <meta name="description" content="atto" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#e95c20]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Apply for a workshop
                    </h1>
                    <div className="w-full max-w-3xl">
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name:
                                <input className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={name} onChange={(e) => setName(e.target.value)}

                                    name="name" type="text" />
                            </label>
                            <label className="pt-2 block text-gray-700 text-sm font-bold mb-2">
                                Pronouns:
                                <input className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={pronouns} onChange={(e) => setPronouns(e.target.value)}
                                    name="pronouns" type="text" />
                            </label>
                            <label className="pt-2 block text-gray-700 text-sm font-bold mb-2">
                                Email:
                                <input className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    name="email" type="text" />
                            </label>

                            <div className="flex items-center mb-4">
                                <label>
                                    Select workshop:
                                    {
                                        workshopOptions.map(w => (
                                            <label key={w.name} className="pt-2 block text-gray-700 text-sm font-bold mb-2 ml-2 ">
                                                <input
                                                    className="w-4 h-4"
                                                    type="radio"
                                                    checked={workshop === w.name}
                                                    onChange={() => setWorkshop(w.name)}
                                                    value={w.name} />
                                                {w.display}
                                            </label>
                                        ))
                                    }
                                </label>
                            </div>

                            <label className="pt-2 block text-gray-700 text-sm font-bold mb-2">
                                Spotlight Link/Credits/Place of Training:
                                <textarea className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={credits} onChange={(e) => setCredits(e.target.value)}
                                    name="name" rows={2} />
                            </label>

                            <div className="flex items-center mb-4">
                                <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={emailPreference} onChange={(e) => setEmailPreference(e.target.checked)}
                                    type="checkbox" />
                                <label className="ml-2 text-sm font-medium text-gray-700">I don&apos;t wish to be emailed with atto news &apos; upcoming workshops.</label>
                            </div>

                            <button type="submit" className="mt-5 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                                onClick={(e) => handleSendForm(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </main >
        </>
    )
}

