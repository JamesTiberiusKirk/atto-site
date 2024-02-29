import { withSessionSsr } from "lib/auth/withSession";
import type { LoginRequest } from "types/loginRequests";
import AttoPage from "~/components/page";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";
import type { Workshop } from "types/workshop";
import { WorkshopsCard } from "~/components/workshop";
import { getAllTestimonials } from "lib/db/testimonials";
import type { CarouselData, Testimonial } from "types/testimonial";

type SelfUpdateTestimonialsPageProps = {
  user: LoginRequest;
  testimonials: Testimonial[]
  carouselData: CarouselData
}

export default function SelfUpdateTestimonials(props: SelfUpdateTestimonialsPageProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(props.testimonials)
  const [carouselData, setCarouselData] = useState<CarouselData[]>(props.carouselData)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial|undefined>()
  const [deletionConfirm, setDeletionConfirm] = useState<string|undefined>(undefined)
  const [workshopUpdateError, setWorkshopUpdateError] = useState<string | null>(null)
  const [hasChanged, setHaChanged] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const originalArray = JSON.stringify(props.testimonials)

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files || !inputFileRef.current?.files[0]) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(
      `/api/selfupdate/image?type=testimonial_headshot&filename=${encodeURIComponent(file.name)}`,
      {
        method: 'POST',
        body: file,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const apiRes = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (apiRes.error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      setImageUploadError(apiRes.error)
      return
    } 

    const url = (apiRes as PutBlobResult).url 
    setCurrentTestimonial({
      ...currentTestimonial,
      imgPath: url,
    } as Workshop)
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRadioChange =  (e: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const key = e.currentTarget.value
    setCurrentTestimonial(testimonials.find(t=>t.key===key))
  }


  const sendTestimonials = async () => {
    setLoading(true)
    const response = await fetch(
      `/api/selfupdate/testimonials`,
      {
        method: 'POST',
        body: JSON.stringify({testimonials:testimonials, carouselData: carouselData }),
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiRes = await response.json() as {data: any, error: string}
    if (apiRes.error) {
      setWorkshopUpdateError(apiRes.error)
    } 
    setLoading(false)
  }

  useEffect(()=>{
    setHaChanged(!(JSON.stringify(testimonials)===originalArray))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[testimonials])

  return (
    <AttoPage>
      <div className="p-4">
        <h1 className="p-6 mx-auto text-center text-3xl">
          Self Update: Testimonials
        </h1>
        <div className="w-full flex flex-row">
          <div className="w-1/3 bg-[#FF955F] rounded-lg m-2 text-white">
            <h1 className="p-6 mx-auto text-center text-xl">
              Currently stored workshops:
            </h1>
            <div className="p-6 w-full">
              <table className="mx-auto">
                <thead>
                  <tr>
                    <th>Workshop</th>
                    <th>Display</th>
                    {deletionConfirm ? (
                      <th>You sure?</th>
                    ) : (
                        <th>Delete</th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map(w=>(
                    <tr key={w.key}>
                      <td>
                        <input
                          id={`select-${w.key}`}
                          checked={(currentTestimonial?.key===w.key)}
                          value={w.key} 
                          type="radio"
                          onChange={onRadioChange}
                        />
                        <label
                          className="p-3"
                          htmlFor={`select-${w.key}`}>
                          {(w.instructorName) ? w.instructorName : "EMPTY"}, {(w.date) ? w.date : "EMPTY"}
                        </label>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={w.display}
                          onChange={() => {
                            const update = testimonials.map(wrk=>{

                              if (wrk.key===w.key){
                                return {...wrk, display:!wrk.display}
                              }

                              return wrk
                            })
                            setTestimonials([...update])
                          }} />
                      </td>

                      <td>
                        {deletionConfirm === w.key ? (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-full"
                            onClick={()=>{
                              setTestimonials([...testimonials.filter(work=>work.key!==w.key)])
                              setDeletionConfirm("")
                            }}
                          >?</button>
                        ) : (
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                              onClick={()=>{
                                setDeletionConfirm(w.key)
                              }}
                            >X</button>
                          )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={()=>{
                          setTestimonials([...testimonials, {
                            instructorName: "",
                            key: `EMPTY-${testimonials.length}`,
                            imgPath: "",
                            desc: "",
                            type: "",
                            date: "",
                            time: "",
                            price: "",
                            link: "",
                            display: false,
                          } as Workshop ])
                        }}
                      >New</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-1/3 m-2">
            {currentTestimonial && (
              <div className="rounded-lg  p-5 bg-gray-200">
                <div>
                  <h1>Upload picture for workshop</h1>
                  <form onSubmit={(event)=>void formSubmit(event)} >
                    <input
                      name="file" ref={inputFileRef} type="file" required />
                    <br/>
                    <button 
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full my-2"
                      type="submit">Upload</button>
                  </form>

                  {imageUploadError && (
                    <div>
                      Error: { imageUploadError }
                    </div>
                  )}
                </div>

                <div>
                  <form>
                    <label htmlFor="workshopFormInstructorName">Instructo&apos;s Name:</label>
                    <input
                      id="workshopFormInstructorName"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="intructor_name"
                      required
                      value={currentTestimonial?.instructorName}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, instructorName:e.target.value})}}
                    />
                    <br/>
                    <label htmlFor="workshopFormDescription">Description:</label>
                    <br/>
                    <textarea
                      id="workshopFormDescription"
                      className="border-gray-200 p-2 border-solid border-2 w-full whitespace-pre-line"
                      name="desc"
                      rows={10}
                      value={currentTestimonial?.desc}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, desc:e.target.value})}}
                      required
                    />
                    <br/>
                    <br/>
                    <label htmlFor="workshopFormType">Type/Title:</label>
                    <br/>
                    <textarea
                      id="workshopFormType"
                      className="border-gray-200 p-2 border-solid border-2 w-full whitespace-pre-line"
                      name="type"
                      rows={5}
                      value={currentTestimonial?.type}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, type:e.target.value})}}
                      required
                    />
                    <br/>

                    <label htmlFor="workshopFormDate">Date</label>
                    <input
                      id="workshopFormDate"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="date"
                      required
                      value={currentTestimonial?.date}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, date:e.target.value})}}
                    />
                    <br/>

                    <label htmlFor="workshopFormTime">Time</label>
                    <input
                      id="workshopFormTime"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="time"
                      required
                      value={currentTestimonial?.time}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, time:e.target.value})}}
                    />
                    <br/>

                    <label htmlFor="workshopFormPrice">Price</label>
                    <input
                      id="workshopFormPrice"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="price"
                      required
                      value={currentTestimonial?.price}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, price:e.target.value})}}
                    />
                    <br/>

                    <label htmlFor="workshopFormLink">Portfolio Link: (MUST include &quot;https://&quot;)</label>
                    <input
                      id="workshopFormLint"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="Link"
                      required
                      value={currentTestimonial?.link}
                      onChange={(e)=>{setCurrentTestimonial({...currentTestimonial, link:e.target.value})}}
                    />
                    <br/>
                    <br/>

                  </form>
                </div>
              </div>
            )}

          </div>
          <div className="w-1/3 p-2">
            {currentTestimonial && (
              <WorkshopsCard workshops={[currentTestimonial]}/>
            )}
          </div>

        </div>

        <div className="pt-10 mx-auto w-2/3">
          { hasChanged &&( <p className="text-red-400">Unsaved Changes</p> )}
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => void sendTestimonials()}
          >
            {loading ? (
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
            ):(
                <>Update workshops</>
              )}
          </button>

        </div>

        {workshopUpdateError && (
          <div>
            Error: { workshopUpdateError }
          </div>
        )}
      </div>

    </AttoPage>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/admin/unauthorised",
          permanent: true,
        },
      };
    }

    const r = {
      props: {
        user: user,
      } as SelfUpdateTestimonialsPageProps,
    };

    // TODO: need to get all of the workshops from the db
    const testimonials = await getAllTestimonials()
    if (testimonials.error){
      throw testimonials.error
    }
    
    r.props.testimonials = testimonials.data?.testimonials as Testimonial[]
    r.props.carouselData = testimonials.data?.carouselData as CarouselData


    return r;
  }
);
