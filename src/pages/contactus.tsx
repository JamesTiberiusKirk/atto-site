import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { TbChairDirector } from "react-icons/tb";
import AttoPage from "~/components/page";
import { api } from "~/utils/api";

// TODO: Need to create confimation screen for this
// Could standardise it by making use of regex in routes and have a route parm?
export default function Contactus(): JSX.Element {
  const router = useRouter();
  const mutation = api.contactus.new.useMutation({
    onMutate: () => {
      void router.push("/confirmation");
    },
  });

  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSendForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("handle send form");
    mutation.mutate({
      name,
      email,
      pronouns,
      message,
    });
  }

  const isFieldWrong = (fieldName: string): boolean => {
    if (!mutation.isError) return false;
    return mutation.error.data?.zodError?.fieldErrors[fieldName] !== undefined;
  };

  const getErrorMessages = (fieldName: string): string[] => {
    return mutation.error?.data?.zodError?.fieldErrors[fieldName] as string[];
  };

  return (
    <AttoPage>
      <div className="flex min-h-screen flex-col items-center bg-[#FF955F] px-4 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex pb-6">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Contact Us
            </h1>
            <Link href="/" className="">
              <TbChairDirector className="h-16 w-16" color="white" />
            </Link>
          </div>
          <form className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Name:
              <input
                className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
              />
            </label>
            <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
              Pronouns:
              <input
                className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                name="pronouns"
                type="text"
              />
            </label>
            <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
              {mutation.isError && isFieldWrong("email") ? (
                <span className="text-red-600">
                  Email: {getErrorMessages("email").map((s) => s + " ")}
                </span>
              ) : (
                <>Email:</>
              )}
              <input
                className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="text"
              />
            </label>

            <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
              Message
              <textarea
                className="focus:shadow-outline w-full appearance-none rounded-lg border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                name="name"
                rows={2}
              />
            </label>

            {mutation.isError && (
              <div className="text-red-600">
                Error has occured when sending forms
              </div>
            )}

            <button
              type="submit"
              className="focus:shadow-outline mt-5  w-full rounded-full bg-[#8C2F00] py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              onClick={(e) => handleSendForm(e)}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="mr-3 inline h-4 w-4 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </AttoPage>
  );
}
