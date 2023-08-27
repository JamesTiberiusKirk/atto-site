import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AttoPage from "~/components/page";
import { api } from "~/utils/api";
import { TbChairDirector } from "react-icons/tb";
import Link from "next/link";
import { workshops } from "types/workshop";
import { Application, ApplicationSchema, Referee } from "types/application";
import { ZodError, ZodFormattedError } from "zod";

// TODO: need to handle input validation here
export default function Apply() {
  const router = useRouter();
  const selected = router.query["opt"];

  const mutation = api.apply.new.useMutation({
    onSuccess: () => {
      void router.push("/confirmation?t=appl");
    },
  });

  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [workshopsState, setWorkshopsState] = useState<string[]>([]);
  const [credits, setCredits] = useState("");
  const [emailPreference, setEmailPreference] = useState(false);
  const [referred, setReferred] = useState(false);
  const [referee, setReferee] = useState<Partial<Referee> | undefined>(
    undefined
  );
  const [formErrors, setFormErrors] =
    useState<ZodFormattedError<Application>>();

  const toggleWorkshop = (workshop: string) => {
    const index = workshopsState.indexOf(workshop);
    const copy = [...workshopsState];
    console.log(index, copy);
    if (index === -1) {
      copy.push(workshop);
    } else {
      copy.splice(index, 1);
    }
    console.log(index, copy);
    setWorkshopsState(copy);
  };

  function handleSendForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // if (workshops.length === 0) return;
    // if (name.length === 0) return;
    // if (email.length === 0) return;

    const form = ApplicationSchema.safeParse({
      name,
      email,
      pronouns,
      phoneNumber,
      workshops: workshopsState,
      credits,
      emailPreference,
      referee: referee as Referee,
    });

    if (form.success === false) {
      const err = form.error as ZodError;
      console.log("errors", formErrors);
      setFormErrors(err.format() as ZodFormattedError<Application>);
      return;
    }

    mutation.mutate({
      name,
      email,
      pronouns,
      phoneNumber,
      workshops: workshopsState,
      credits,
      emailPreference,
      referee: referee as Referee,
    });
  }

  // Emtpy array means it only runs once
  useEffect(() => {
    if (selected && typeof selected === "string") {
      toggleWorkshop(selected);
    }

    if (selected && typeof selected === "object") {
      selected.map((s) => {
        toggleWorkshop(s);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AttoPage>
      <div className="flex min-h-screen flex-col items-center bg-[#FF955F] px-4 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Apply for a workshop
            </h1>
            <Link href="/">
              <TbChairDirector className="h-24 w-24" color="white" />
            </Link>
          </div>
          <form className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {formErrors && formErrors?.name ? (
                <span className="text-red-600">
                  Name: {formErrors?.name?._errors.map((s) => s + " ")}
                </span>
              ) : (
                <>Name:</>
              )}
              <input
                className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
              />
            </label>
            <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
              {formErrors && formErrors?.pronouns ? (
                <span className="text-red-600">
                  Pronouns: {formErrors.pronouns._errors.map((s) => s + " ")}
                </span>
              ) : (
                <>Pronouns:</>
              )}
              <input
                className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                name="pronouns"
                type="text"
              />
            </label>
            <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
              {formErrors && formErrors.email ? (
                <span className="text-red-600">
                  Email: {formErrors.email._errors.map((s) => s + " ")}
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
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {formErrors && formErrors.phoneNumber ? (
                <span className="text-red-600">
                  Phone number:{" "}
                  {formErrors.phoneNumber._errors.map((s) => s + " ")}
                </span>
              ) : (
                <>Phone number:</>
              )}
              <input
                className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                name="phoneNumber"
                type="text"
              />
            </label>

            <div className="mb-4 flex items-center">
              <label>
                Select workshop:
                {workshops.length > 0 ? (
                  workshops.map((w) => (
                    <div key={w.key} className="flex items-center">
                      <input
                        checked={
                          workshopsState.find((v) => v === w.key) === w.key
                        }
                        id="checked-checkbox"
                        type="checkbox"
                        onChange={() => toggleWorkshop(w.key)}
                        value={w.key}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-red-600 focus:ring-2  focus:ring-red-500"
                      />
                      <label className="ml-2 text-sm font-medium">
                        {w.instructorName} - {w.date}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>
                    Not currently taking applictions, please check again later
                  </p>
                )}
              </label>
            </div>

            <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
              Spotlight Link/Credits/Place of Training:
              <textarea
                className="focus:shadow-outline w-full appearance-none rounded-lg border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                name="name"
                rows={2}
              />
            </label>

            <div className="mb-4 flex items-center">
              <input
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={emailPreference}
                onChange={(e) => setEmailPreference(e.target.checked)}
                type="checkbox"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                I don&apos;t wish to be emailed with atto news &apos; upcoming
                workshops.
              </label>
            </div>

            <br />
            <div className="mb-4  flex items-center text-lg">
              <input
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={referred}
                onChange={(e) => {
                  e ? setReferee({}) : setReferee(undefined);
                  setReferred(e.target.checked);
                }}
                type="checkbox"
              />
              <label className="ml-2 text-[#FF955F]">
                <b>Refer a friend! </b>
                <br />
                <p className="text-sm text-gray-700">
                  On referal, both partiess get £10 off your next workshop!
                </p>
              </label>
            </div>

            {referred && referee && (
              <div className="mx-auto w-3/4 items-center justify-center rounded bg-[#FF955F] p-2 text-white">
                <label className="mb-2 block text-sm font-bold ">
                  {formErrors &&
                  formErrors.referee &&
                  formErrors.referee.name ? (
                    <span className="text-red-600">
                      Name:{" "}
                      {formErrors.referee.name._errors.map((s) => s + " ")}
                    </span>
                  ) : (
                    <>Name:</>
                  )}
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                    value={referee.name}
                    onChange={(e) =>
                      setReferee({ ...referee, name: e.target.value })
                    }
                    name="referee.name"
                    type="text"
                  />
                </label>
                <label className="mb-2 block pt-2 text-sm font-bold">
                  {formErrors &&
                  formErrors.referee &&
                  formErrors.referee.pronouns ? (
                    <span className="text-red-600">
                      Pronouns:{" "}
                      {formErrors.referee.pronouns._errors.map((s) => s + " ")}
                    </span>
                  ) : (
                    <>Pronouns:</>
                  )}
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                    value={referee.pronouns}
                    onChange={(e) =>
                      setReferee({ ...referee, pronouns: e.target.value })
                    }
                    name="referee.pronouns"
                    type="text"
                  />
                </label>
                <label className="mb-2 block pt-2 text-sm font-bold ">
                  {formErrors &&
                  formErrors.referee &&
                  formErrors.referee.email ? (
                    <span className="text-red-600">
                      Email:{" "}
                      {formErrors.referee.email._errors.map((s) => s + " ")}
                    </span>
                  ) : (
                    <>Email:</>
                  )}
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                    value={referee.email}
                    onChange={(e) =>
                      setReferee({ ...referee, email: e.target.value })
                    }
                    name="referee.email"
                    type="text"
                  />
                </label>
                <label className="mb-2 block text-sm font-bold">
                  {formErrors &&
                  formErrors.referee &&
                  formErrors.referee.phoneNumber ? (
                    <span className="text-red-600">
                      Phone number:{" "}
                      {formErrors.referee.phoneNumber._errors.map(
                        (s) => s + " "
                      )}
                    </span>
                  ) : (
                    <>Phone number:</>
                  )}
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                    value={referee.phoneNumber}
                    onChange={(e) =>
                      setReferee({ ...referee, phoneNumber: e.target.value })
                    }
                    name="referee.phoneNumber"
                    type="text"
                  />
                </label>
              </div>
            )}

            {/* {mutation.isError && */}
            {/*   mutation.error?.data?.code == "INTERNAL_SERVER_ERROR" && ( */}
            {/*     <div className="text-red-600"> */}
            {/*       Error has occured when sending forms */}
            {/*     </div> */}
            {/*   )} */}

            {mutation.isError && (
              <div className="text-red-600">
                Error has occured when sending forms
              </div>
            )}

            <button
              type="submit"
              className={`focus:shadow-outline mt-5 w-full  rounded-full bg-[#8C2F00] py-2 px-4 font-bold text-white focus:outline-none ${
                workshops.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-red-700"
              }`}
              onClick={(e) => handleSendForm(e)}
              disabled={mutation.isLoading || workshops.length === 0}
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
          <p className="text-white">
            <span className="text-red-800">*</span> If you are unable to attend
            a workshop we can only offer a workshop credit. This is to keep atto
            operable. We thank you for your understanding.
          </p>
        </div>
      </div>
    </AttoPage>
  );
}
