import { withSessionSsr } from "lib/auth/withSession";
import type { LoginRequest } from "types/loginRequests";
import AttoPage from "~/components/page";
import { FormEvent, useEffect, useRef, useState } from "react";
import { PutBlobResult } from "@vercel/blob";
import { Workshop } from "types/workshop";
import { WorkshopsCard } from "~/components/workshop";
import { workshops } from "types/workshop";
import { imageOptimizer } from "next/dist/server/image-optimizer";

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

  useEffect(()=>{
    console.log(workshops)
  },[workshops])

  return (
    <AttoPage>
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
                      <input type="checkbox" checked={w.display} />
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
                  <input name="file" ref={inputFileRef} type="file" required />
                  <br/>
                  <button type="submit">Upload</button>
                </form>

                {imageUploadError && (
                  <div>
                    Error: { imageUploadError }
                  </div>
                )}
              </div>

              <div>
                <form onSubmit={()=>{}} >
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
                    name="intructor_name"
                    rows={10}
                    value={currentWorkshop?.desc}
                    onChange={(e)=>{setCurrentWorkshop({...currentWorkshop, desc:e.target.value})}}
                    required
                  />
                  <br/>

                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    type="submit">Update</button>
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
        workshops: workshops,
      } as SelfUpdatePageProps,
    };

    // TODO: need to get all of the workshops from the db

    return r;
  }
);
