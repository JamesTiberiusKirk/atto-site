import { withSessionSsr } from "lib/auth/withSession";
import AttoPage from "~/components/page";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { getAllTestimonials } from "lib/db/testimonials";
import Testimonials from "~/components/testimonials";

import type { CarouselData, Picture, Quotes, Testimonial } from "types/testimonial";
import type { LoginRequest } from "types/loginRequests";
import type { PutBlobResult } from "@vercel/blob";
import Image from "next/image";

type SelfUpdateTestimonialsPageProps = {
  user: LoginRequest;
  testimonials: Testimonial[]
  carouselData: CarouselData
}

export default function SelfUpdateTestimonials(props: SelfUpdateTestimonialsPageProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(props.testimonials??[])
  const [currenctlySelectedTestimonialIndex, setCurrenctlySelectedTestimonialIndex] = useState<number|undefined>(undefined)
  const [currenctlySelectedTestimonial, setCurrenctlySelectedTestimonial] = useState<Testimonial|undefined>(undefined)
  const [carouselQuotes, setCarouselQuotes] = useState<Quotes[]>(props.carouselData.quotes)
  const [carouselPictures, setCarouselPictures] = useState<Picture[]>(props.carouselData.pictures)

  const inputFileRef = useRef<HTMLInputElement>(null);
  const carouselInputFileRef = useRef<HTMLInputElement>(null);
  const [deletionConfirm, setDeletionConfirm] = useState<number|undefined>(undefined)
  const [carouselQuoteDeletionConfirm, setCarouselQuoteDeletionConfirm] = useState<number|undefined>(undefined)
  const [carouselPictureDeletionConfirm, setCarouselPictureDeletionConfirm] = useState<number|undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [hasChanged, setHasChanged] = useState<boolean>(false)


  useEffect(()=>{
    if (currenctlySelectedTestimonialIndex===undefined) return 
    if (testimonials[currenctlySelectedTestimonialIndex]===undefined) return 

    setCurrenctlySelectedTestimonial(testimonials[currenctlySelectedTestimonialIndex])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currenctlySelectedTestimonialIndex])

  let originalData = JSON.stringify({testimonials:props.testimonials??[], carouselData: props.carouselData})
  useEffect(()=>{
    const now = JSON.stringify({
      testimonials,
      carouselData: {
        quotes: carouselQuotes,
        pictures: carouselPictures,
      },
    })
    setHasChanged(now!==originalData)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[testimonials, carouselQuotes, carouselPictures])

  // save currenctlySelectedTestimonial to the array
  useEffect(()=>{
    if (currenctlySelectedTestimonial===undefined) return 
    if (currenctlySelectedTestimonialIndex===undefined) return 
    if (testimonials[currenctlySelectedTestimonialIndex]===undefined) return 

    const t = testimonials
    t[currenctlySelectedTestimonialIndex] = currenctlySelectedTestimonial
    setTestimonials([...t])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currenctlySelectedTestimonial])

  const onTestimonialDisplayChange = (key: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    if (testimonials[key]===undefined){
      return
    } 
    
    // NOTE: feels like this is a bomb waiting to go off but lsp erroring if i dont use the !
    testimonials[key]!.display = !(testimonials[key]?.display)
    setTestimonials([...testimonials])
  }


  const [carouselImageUploadError, setCarouselImageUploadError] = useState<string | null>(null)
  const carouselFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!carouselInputFileRef.current?.files || !carouselInputFileRef.current?.files[0]) {
      console.log("no file selected")
      throw new Error('No file selected');
    }

    const file = carouselInputFileRef.current.files[0];

    const response = await fetch(
      `/api/selfupdate/image?type=carousell&filename=${encodeURIComponent(file.name)}`,
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
      setCarouselImageUploadError(apiRes.error)
      return
    } 
    console.log(apiRes)

    const url = (apiRes as PutBlobResult).url 
    setCarouselPictures([...carouselPictures, {link:url, display:false}])
  }

  const [headshotImageUploadError, setHeadshotImageUploadError] = useState<string | null>(null)
  const headshotFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currenctlySelectedTestimonialIndex === undefined) return 

    if (!inputFileRef.current?.files || !inputFileRef.current?.files[0]) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(
      `/api/selfupdate/image?type=carousell&filename=${encodeURIComponent(file.name)}`,
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
      setHeadshotImageUploadError(apiRes.error)
      return
    } 

    const url = (apiRes as PutBlobResult).url 

    if (currenctlySelectedTestimonial===undefined){return}

    const c = currenctlySelectedTestimonial
    c.headshot=url
    setCurrenctlySelectedTestimonial({...c})
  }


  const sendData = async () => {
    setLoading(true)
    const response = await fetch(
      `/api/selfupdate/testimonials`,
      {
        method: 'POST',
        body: JSON.stringify({testimonials, carouselData:{quotes:carouselQuotes, pictures:carouselPictures}}),
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiRes = await response.json() as {data: any, error: string}
    if (apiRes.error) {
      setUpdateError(apiRes.error)
    } 
    setLoading(false)

    originalData = JSON.stringify({testimonials:props.testimonials??[], carouselData: props.carouselData})
    setHasChanged(false)
  }

  const newCarouselQuote = () => {
    setCarouselQuotes([...carouselQuotes, {quote:"", display:false}])
  }

  const setCarouselQuote = (index:number, quote:string) => {
    if (!carouselQuotes[index]) return
    const c = carouselQuotes
    c[index]!.quote = quote
    setCarouselQuotes([...c])
  }

  const toggleCarouselQuoteDisplay = (index:number) => {
    if (!carouselQuotes[index]) return
    const c = carouselQuotes
    c[index]!.display = !c[index]!.display
    setCarouselQuotes([...c])
  }

  const toggleCarouselPictureDisplay = (index:number) => {
    const c = carouselPictures
    if (!carouselPictures[index]) return
    c[index]!.display = !c[index]!.display
    setCarouselPictures([...c])
  }
  return (
    <AttoPage>
      <div className="p-4">
        <h1 className="p-6 mx-auto text-center text-3xl">
          Self Update: Testimonials
        </h1>
        <div className="w-full flex flex-row">
          <div className="w-1/3 bg-[#FF955F] rounded-lg m-2 text-white">
            <h1 className="p-6 mx-auto text-center text-xl">
              Currently stored testimonials:
            </h1>
            <div className="p-6 w-full">
              <table className="mx-auto">
                <thead>
                  <tr>
                    <th>Testimonials</th>
                    <th>Display</th>
                    {deletionConfirm ? (
                      <th>You sure?</th>
                    ) : (
                        <th>Delete</th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((t,i)=>(
                    <tr key={i}>
                      <td>
                        <input
                          id={`select-${i}`}
                          checked={(i===currenctlySelectedTestimonialIndex)}
                          value={i} 
                          type="radio"
                          onChange={()=>setCurrenctlySelectedTestimonialIndex(i)}
                        />
                        <label
                          className="p-3"
                          htmlFor={`select-${i}`}>
                          {t.from} -- “{(t.quote.length >= 20)? t.quote.substring(0,19) + '...' : t.quote }”
                        </label>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={t.display}
                          onChange={()=>onTestimonialDisplayChange(i)} />
                      </td>

                      <td>
                        {deletionConfirm === i ? (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-full"
                            onClick={()=>{
                              const t = testimonials
                              t.splice(i,1)
                              setTestimonials([...t])
                              setDeletionConfirm(undefined)
                            }}
                          >?</button>
                        ) : (
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                              onClick={()=>{
                                setDeletionConfirm(i)
                              }}
                            >X</button>
                          )}
                      </td>
                    </tr>
                  ))}
                  {(testimonials.length <= 0)  && (
                    <tr>
                      <td colSpan={3}>
                        <p>Currently no testimonials</p>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3}>
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={()=>{
                          setTestimonials([...testimonials, {
                            from: "",
                            quote: "",
                            display: false,
                          } as Testimonial ])
                        }}
                      >New</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {carouselPictures.length>0&&(
                <div>
                  <h1 className="p-6 mx-auto text-center text-xl">
                    Currently stored testimonials:
                  </h1>
                  <div className="p-6 w-full">
                    <table className="mx-auto">
                      <thead>
                        <tr>
                          <th>Testimonials</th>
                          <th>Display</th>
                          {deletionConfirm ? (
                            <th>You sure?</th>
                          ) : (
                              <th>Delete</th>
                            )}
                        </tr>
                      </thead>
                      <tbody>
                        {carouselPictures.map((p,i)=>(
                          <tr key={i}>
                            <td>
                              <Image
                                src={p.link}
                                width={150}
                                height={150}
                                alt={`Carousel Image ${i}`}
                              />
                            </td>

                            <td>
                              <input
                                type="checkbox"
                                checked={p.display}
                                className="p-2 m-2"
                                onChange={()=>toggleCarouselPictureDisplay(i)} />
                            </td>
                            <td>
                              {carouselPictureDeletionConfirm == i ? (
                                <button
                                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-full"
                                  onClick={()=>{
                                    const p = carouselPictures
                                    p.splice(i,1)
                                    setCarouselPictures([...p])
                                    setCarouselPictureDeletionConfirm(undefined)
                                  }}
                                >?</button>
                              ) : (
                                  <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                                    onClick={()=>{
                                      setCarouselPictureDeletionConfirm(i)
                                    }}
                                  >X</button>
                                )}
                            </td>
                            <td/>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 m-2">
            {((currenctlySelectedTestimonialIndex!==undefined) && (currenctlySelectedTestimonial!==undefined)) ? (
              <div className="rounded-lg mb-2 p-5 bg-gray-200">
                <h1>Testimonial</h1>
                <div>
                  <h1>Upload picture for the testimonial</h1>
                  <form onSubmit={(event)=>void headshotFormSubmit(event)} >
                    <input
                      name="file" ref={inputFileRef} type="file" required />
                    <br/>
                    <button 
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full my-2"
                      type="submit">Upload</button>
                  </form>

                  {headshotImageUploadError && (
                    <div>
                      Error: { headshotImageUploadError }
                    </div>
                  )}
                </div>

                <div>
                    <label htmlFor="testimonial_name">Name:</label>
                    <input
                      id="testimonial_name"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="from"
                      required
                      value={currenctlySelectedTestimonial.from}
                      onChange={(e)=>{setCurrenctlySelectedTestimonial({...currenctlySelectedTestimonial, from:e.target.value})}}
                    />
                    <br/>
                    <label htmlFor="testimonial_quote">Quote:</label>
                    <br/>
                    <textarea
                      id="testimonial_quote"
                      className="border-gray-200 p-2 border-solid border-2 w-full whitespace-pre-line"
                      name="quote"
                      rows={10}
                      value={currenctlySelectedTestimonial.quote}
                      onChange={(e)=>{setCurrenctlySelectedTestimonial({...currenctlySelectedTestimonial, quote:e.target.value})}}
                      required
                    />
                    <br/>
                    <br/>
                </div>
              </div>
            ):(

              <div className="rounded-lg mb-2 p-5 bg-gray-200">
                <h1>Testimonial</h1>
                  <p>Please select a testimonial to edit on the left hand side</p>
              </div>
              )}

            {((carouselQuotes!==undefined)) && (
              <div className="rounded-lg p-5 bg-gray-200">
                <h1>Carousel Data</h1>
                <div>
                  <h1>Upload picture for the coursel</h1>
                  <form onSubmit={(event)=>void carouselFormSubmit(event)} >
                    <input
                      name="file" ref={carouselInputFileRef} type="file" required />
                    <br/>
                    <button 
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full my-2"
                      type="submit">Upload</button>
                  </form>

                  {carouselImageUploadError && (
                    <div>
                      Error: { carouselImageUploadError }
                    </div>
                  )}
                </div>
                <div>
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th>
                          Quotes
                        </th>
                        <th>
                          Display
                        </th>
                        {carouselQuoteDeletionConfirm ? (
                          <th>Sure??</th>
                        ) : (
                            <th>Delete</th>
                          )}
                      </tr>
                    </thead>
                    <tbody>
                      {carouselQuotes.map((q,i)=>(
                        <tr key={i}>
                          <td>
                            <textarea
                              id="workshopFormInstructorName"
                              className="border-gray-200 border-solid border-2 p-2 w-full"
                              name="intructor_name"
                              value={q.quote}
                              onChange={(e)=>{setCarouselQuote(i, e.target.value)}}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={q.display}
                              className="p-2 m-2"
                              onChange={()=>toggleCarouselQuoteDisplay(i)} />
                          </td>
                          <td>
                            {carouselQuoteDeletionConfirm == i ? (
                              <button
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-full"
                                onClick={()=>{
                                  const q = carouselQuotes
                                  q.splice(i,1)
                                  setCarouselQuotes([...q])
                                  setCarouselQuoteDeletionConfirm(undefined)
                                }}
                              >?</button>
                            ) : (
                                <button
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                                  onClick={()=>{
                                    setCarouselQuoteDeletionConfirm(i)
                                  }}
                                >X</button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br/>
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={()=>newCarouselQuote()}
                  >New Quote</button>
                </div>
              </div>
            )}

          </div>
          <div className="w-1/3 p-2">
            {testimonials.length>0 && (
              <div className="rounded-lg border border-2 border-black">
                <Testimonials
                  testimonials={testimonials}
                  carouselData={{
                    quotes:carouselQuotes,
                    pictures:carouselPictures,
                  }}
                />
              </div>
            )}
          </div>

        </div>

        <div className="pt-10 mx-auto w-2/3">
          { hasChanged &&( <p className="text-red-400">Unsaved Changes</p> )}
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => void sendData()}
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


        {updateError && (
          <div>
            Error: { updateError }
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
    
    r.props.testimonials = testimonials.data?.testimonials as Testimonial[] ?? null
    r.props.carouselData = testimonials.data?.carouselData as CarouselData

    console.log(r.props)

    return r;
  }
);
