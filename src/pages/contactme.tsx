import AttoPage from "~/components/page";
import { api } from "~/utils/api";

export default function ContactMe(): JSX.Element {
    const mutation = api.contactMe.new.useMutation()
    const handleSendForm = () => {
        console.log('handle send form')
        mutation.mutate({
            name: 'test name',
            email: 'test@gmail.com',
            pronouns: 'king',
            workshop: 'workshop a',
            credits: 'fancy school in london',
            emailPreference: false,
        })
    }


    return (
        <AttoPage>
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    Contact me
                </h1>
                <input type="button" onClick={handleSendForm} title="Send form" />
                <button onClick={handleSendForm}>Send Form</button>
            </div>
        </AttoPage>
    )
}

