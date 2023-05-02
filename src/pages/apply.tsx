import { useRouter } from 'next/router';
import { useState } from 'react';
import AttoPage from '~/components/page';
import { api } from '~/utils/api';
import { TbChairDirector } from 'react-icons/tb'
import Link from 'next/link';

// TODO: need to handle input validation here
export default function Apply() {
    const router = useRouter()
    const mutation = api.apply.new.useMutation({
        onSuccess: () => {
            void router.push('/confirmation?t=appl')
        }
    })

    // TODO: Add workshops 
    const workshopOptions = [
        {
            display: 'Harold Pinter The Caretaker',
            name: 'HAROLD_PINTER_THE_CARETAKER'
        },
        {
            display: 'Harold Pinter Betrayer',
            name: 'HAROLD_PINTER_BETRAYER'
        },
    ] as {
        display: string,
        name: string,
    }[]

    const [name, setName] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [email, setEmail] = useState('')
    const [workshops, setWorkshops] = useState<string[]>([])
    const [credits, setCredits] = useState('')
    const [emailPreference, setEmailPreference] = useState(false)

    const toggleWorkshop = (workshop: string) => {
        const index = workshops.indexOf(workshop)
        const copy = [...workshops]
        console.log(index, copy)
        if (index === -1) {
            copy.push(workshop)
        } else {
            copy.splice(index, 1)
        }
        console.log(index, copy)
        setWorkshops(copy)
    }


    function handleSendForm(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (workshopOptions.length === 0) return

        console.log('handle send form');
        mutation.mutate({
            name,
            email,
            pronouns,
            workshops,
            credits,
            emailPreference,
        });
    }

    const isFieldWrong = (fieldName: string): boolean => {
        if (!mutation.isError) return false
        return (mutation.error.data?.zodError?.fieldErrors[fieldName] !== undefined)
    }

    const getErrorMessages = (fieldName: string): string[] => {
        return mutation.error?.data?.zodError?.fieldErrors[fieldName] as string[]
    }

    return (
        <AttoPage >
            <div className='min-h-screen flex flex-col items-center px-4 py-16 bg-[#FF955F]'>
                <div className='max-w-3xl'>
                    <div className='inline-flex'>
                        <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]'>
                            Apply for a workshop
                        </h1>
                        <Link href='/'>
                            <TbChairDirector
                                className='h-24 w-24'
                                color='white'
                            />
                        </Link>
                        {/* <GiDirectorChair */}
                        {/*     className='h-24 w-24' */}
                        {/*     color='white' */}
                        {/* /> */}
                    </div>
                    <p className='text-white py-5'>
                        Please choose the workshops you wish to attend. We advise choosing more than one, to avoid missing out as workshops can fill up.
                    </p>
                    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Name:
                            <input className='shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                name='name' type='text'
                            />
                        </label>
                        <label className='pt-2 block text-gray-700 text-sm font-bold mb-2'>
                            Pronouns:
                            <input className='shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                value={pronouns} onChange={(e) => setPronouns(e.target.value)}
                                name='pronouns' type='text' />
                        </label>
                        <label className='pt-2 block text-gray-700 text-sm font-bold mb-2'>
                            {mutation.isError && isFieldWrong('email') ? (
                                <span className='text-red-600'>Email: {getErrorMessages('email').map(s => s + ' ')}</span>
                            ) : (
                                <>Email:</>
                            )}
                            <input className='shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                name='email' type='text' />
                        </label>

                        <div className='flex items-center mb-4'>
                            <label>
                                Select workshop:
                                {workshopOptions.length > 0 ? workshopOptions.map(w => (
                                    <div key={w.name} className='flex items-center'>
                                        <input
                                            checked={workshops.find(v => v === w.name) === w.name}
                                            id='checked-checkbox'
                                            type='checkbox'
                                            onChange={() => toggleWorkshop(w.name)}
                                            value={w.name}
                                            className='w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500  focus:ring-2' />
                                        <label className='ml-2 text-sm font-medium'>{w.display}</label>
                                    </div>
                                )) : (
                                    <p>Not currently taking applictions, please check again later</p>
                                )}
                            </label>
                        </div>

                        <label className='pt-2 block text-gray-700 text-sm font-bold mb-2'>
                            Spotlight Link/Credits/Place of Training:
                            <textarea className='shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                value={credits}
                                onChange={(e) => setCredits(e.target.value)}
                                name='name'
                                rows={2} />
                        </label>

                        <div className='flex items-center mb-4'>
                            <input className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                checked={emailPreference} onChange={(e) => setEmailPreference(e.target.checked)}
                                type='checkbox' />
                            <label className='ml-2 text-sm font-medium text-gray-700'>I don&apos;t wish to be emailed with atto news &apos; upcoming workshops.</label>
                        </div>

                        {(mutation.isError && mutation.error?.data?.code) == 'INTERNAL_SERVER_ERROR' && (
                            <div className='text-red-600'>Error has occured when sending forms</div>
                        )}

                        <button type='submit' className={`mt-5 w-full bg-[#8C2F00]  text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${workshopOptions.length === 0 ?
                            'opacity-50 cursor-not-allowed' :
                            'hover:bg-red-700'}`
                        }
                            onClick={(e) => handleSendForm(e)}
                            disabled={mutation.isLoading || workshopOptions.length === 0}>
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
                    <p className='text-white'>
                        <span className='text-red-800'>*</span> If you are unable to attend a workshop, and have given at least 48 hours notice, we will offer a full refund or workshop credit.
                        If given 24 hours notice, we can only offer a workshop credit.
                    </p>
                </div>
            </div>
        </AttoPage >
    )
}

