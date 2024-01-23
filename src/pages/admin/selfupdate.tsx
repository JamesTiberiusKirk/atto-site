import { withSessionSsr } from "lib/auth/withSession";
import type { LoginRequest } from "types/loginRequests";
import AttoPage from "~/components/page";
import { FormEvent, useEffect, useRef, useState } from "react";
import { PutBlobResult } from "@vercel/blob";
import { Workshop } from "types/workshop";
import { WorkshopsCard } from "~/components/workshop";
import { getAllWorkshops } from "lib/db/workshop";

type SelfUpdatePageProps = {
  user: LoginRequest;
  workshops: Workshop[];
}

export default function SelfUpdate(props: SelfUpdatePageProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [workshops, setWorkshops] = useState<Workshop[]>(props.workshops)
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop|undefined>(props.workshops.find(w=>w.display))
  const [deletionConfirm, setDeletionConfirm] = useState<string|undefined>(undefined)
  const [workshopUpdateError, setWorkshopUpdateError] = useState<string | null>(null)
  const [hasChanged, setHaChanged] = useState<boolean>(false)


  const originalArray = JSON.stringify(props.workshops)

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files || !inputFileRef.current?.files[0]) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0] as File;

    const response = await fetch(
      `/api/selfupdate/image?type=headshot&filename=${encodeURIComponent(file.name)}`,
      {
        method: 'POST',
        body: file,
      },
    );

    const apiRes = await response.json()
    if (apiRes.error) {
      setImageUploadError(apiRes.error)
      return
    } 

    const url: string =(apiRes as PutBlobResult).url as string
    setCurrentWorkshop({
      ...currentWorkshop,
      imgPath: url,
    } as Workshop)
  }


  const onRadioChange =  (e: any) => {
    const key = e.currentTarget.value
    setCurrentWorkshop( workshops.find(w=>w.key===key))
  }


  const sendWorkshops = async () => {
    const response = await fetch(
      `/api/selfupdate/workshops`,
      {
        method: 'POST',
        body: JSON.stringify({workshops:workshops}),
      },
    );

    const apiRes = await response.json()
    if (apiRes.error) {
      setWorkshopUpdateError(apiRes.error)
      return
    } 
  }

  useEffect(()=>{
    setHaChanged(!(JSON.stringify(workshops)===originalArray))
  },[workshops])

  useEffect(()=>{
    // console.log("useEffect current workshop", currentWorkshop)

    setWorkshops([...workshops.map(w=>{
      if(w.key === currentWorkshop?.key) {
        return { ...currentWorkshop } 
      } else return w
    })])

  },[currentWorkshop])

  return (
    <AttoPage>
      <div >
        <div className="w-full flex flex-row">
          <div className="w-1/3">
            Currently stored workshops:
            <div className="p-5">
              <table>
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
                  {workshops.map(w=>(
                    <tr key={w.key}>
                      <td>
                        <input
                          id={`select-${w.key}`}
                          checked={(currentWorkshop?.key===w.key)}
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
                            const update = workshops.map(wrk=>{

                              if (wrk.key===w.key){
                                return {...wrk, display:!wrk.display}
                              }

                              return wrk
                            })
                            setWorkshops([...update])
                          }} />
                      </td>

                      <td>
                        {deletionConfirm === w.key ? (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-full"
                            onClick={()=>{
                              setWorkshops([...workshops.filter(work=>work.key!==w.key)])
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
                          setWorkshops([...workshops, {
                            instructorName: "",
                            key: `EMPTY-${workshops.length}`,
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
          <div className="w-1/3">
            {currentWorkshop && (
              <div className="p-5 bg-gray-100">
                <div>
                  <h1>Upload Your Avatar</h1>
                  <form onSubmit={formSubmit} >
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
                    <label htmlFor="workshopFormInstructorName">Instructo's Name:</label>
                    <input
                      id="workshopFormInstructorName"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="intructor_name"
                      required
                      value={currentWorkshop?.instructorName}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, instructorName:e.target.value})}}
                    />
                    <br/>
                    <label htmlFor="workshopFormDescription">Description:</label>
                    <br/>
                    <textarea
                      id="workshopFormDescription"
                      className="border-gray-200 p-2 border-solid border-2 w-full whitespace-pre-line"
                      name="desc"
                      rows={10}
                      value={currentWorkshop?.desc}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, desc:e.target.value})}}
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
                      value={currentWorkshop?.type}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, type:e.target.value})}}
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
                      value={currentWorkshop?.date}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, date:e.target.value})}}
                    />
                    <br/>

                    <label htmlFor="workshopFormTime">Time</label>
                    <input
                      id="workshopFormTime"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="time"
                      required
                      value={currentWorkshop?.time}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, time:e.target.value})}}
                    />
                    <br/>

                    <label htmlFor="workshopFormPrice">Price</label>
                    <input
                      id="workshopFormPrice"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="price"
                      required
                      value={currentWorkshop?.price}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, price:e.target.value})}}
                    />
                    <br/>

                    <label htmlFor="workshopFormLink">Portfolio Link: (MUST include "https://")</label>
                    <input
                      id="workshopFormLint"
                      className="border-gray-200 border-solid border-2 p-2 w-full"
                      type="text"
                      name="Link"
                      required
                      value={currentWorkshop?.link}
                      onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, link:e.target.value})}}
                    />
                    <br/>
                    <br/>

                  </form>
                </div>
              </div>
            )}

          </div>
          <div className="w-1/3">
            {currentWorkshop && (
              <WorkshopsCard workshops={[currentWorkshop]}/>
            )}
          </div>

        </div>

        <div className="pt-10 mx-auto w-2/3">
          { hasChanged &&( <p className="text-red-400">Unsaved Changes</p> )}
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={
              sendWorkshops
            }
          >
             Update workshops
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
      } as SelfUpdatePageProps,
    };

    // TODO: need to get all of the workshops from the db
    const workshops = await getAllWorkshops()
    if (workshops.error){
      // TODO: need to figure out how to handle this
    }
    
    r.props.workshops = workshops.data as Workshop[]

    return r;
  }
);
