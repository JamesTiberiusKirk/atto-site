import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlinePlayCircle,
  AiOutlineTwitter,
} from "react-icons/ai";
import { IoMdOpen } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import AttoPage from "~/components/page";
import { api } from "~/utils/api";

import type { Workshop } from "types/workshop";
import { workshops } from "types/workshop";
import dfycLogo from "/public/dfyc_logo_small.jpg";
import attoLogo from "/public/logo_with_name.png";
import workshopBannerImage from "/public/small/workshop/dvelped_nice_pic_scaled.png";
import caruselImage1 from "/public/webp/workshop/DSC06413.webp";
import caruselImage2 from "/public/webp/workshop/DSC06435.webp";
import caruselImage3 from "/public/webp/workshop/DSC06437.webp";
import caruselImage4 from "/public/webp/workshop/DSC06451.webp";
import whatWeDoImage from "/public/webp/workshop/dev_10_crop.webp";
import caruselImage6 from "/public/webp/workshop/dev_13.webp";
import caruselImage5 from "/public/webp/workshop/dev_9.webp";

const caruselData = [
  {
    image: caruselImage1,
    imageAlt: "image1",
  },
  {
    image: caruselImage2,
    imageAlt: "image2",
  },
  {
    image: caruselImage3,
    imageAlt: "image3",
  },
  {
    image: caruselImage4,
    imageAlt: "image4",
  },
  {
    image: caruselImage5,
    imageAlt: "image5",
  },
  {
    image: caruselImage6,
    imageAlt: "image6",
  },
];

type WorkshopCardProps = {
  workshop: Workshop;
};

function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <div className="m-5 min-w-fit">
      <div className="flex flex-col items-center text-center">
        {workshop.imgPath ? (
          <div className="h-40 w-40 transform overflow-hidden rounded-full transition duration-100 hover:scale-110">
            <Link href={"/apply?opt=" + workshop.key}>
              <Image
                src={workshop.imgPath}
                alt={"Headshot " + workshop.instructorName}
                width={200}
                height={200}
              />
            </Link>
          </div>
        ) : (
          <Link href={"/apply"}>
            <MdAccountCircle
              className="transform transition duration-100 hover:scale-110"
              size={160}
            />
          </Link>
        )}

        <a className="flex" target="_blank" href={workshop.link}>
          <h1 className="mt-4 text-2xl font-bold">{workshop.instructorName}</h1>
          <IoMdOpen className="mr-1 mt-5" size={15} />
        </a>
        <div>
          <p className="mt-2 text-sm text-white">
            {workshop.desc.map((d, i) => (
              <span key={i}>
                {d}
                <br />
              </span>
            ))}
          </p>
        </div>

        <p className="mt-2 text-sm text-white">
          {workshop.type} <br />
          {workshop.date} <br />
          {workshop.time} <br />
        </p>

        <p className="mt-2 text-sm text-white">{workshop.price}</p>
      </div>
    </div>
  );
}

function NewsLetterSignup() {
  const mutation = api.newsLetter.new.useMutation({
    onSuccess: () => {
      setEmail("");
    },
  });
  const [email, setEmail] = useState("");

  function handleSendForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    mutation.mutate(email);
  }

  const isFieldWrong = (fieldName: string): boolean => {
    if (!mutation.isError) return false;
    return mutation.error.data?.zodError?.fieldErrors[fieldName] !== undefined;
  };

  const getErrorMessages = (fieldName: string): string[] => {
    return mutation.error?.data?.zodError?.fieldErrors[fieldName] as string[];
  };

  return (
    <form className="mt-5 ">
      <label className="mb-2 block pt-2 text-sm font-bold text-gray-700">
        {mutation.isError && isFieldWrong("email") && (
          <span className="text-red-600">
            * {getErrorMessages("email").map((s) => s + " ")}
          </span>
        )}
        <input
          className="focus:shadow-outline w-full appearance-none rounded-full border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          value={email}
          name="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={!mutation.isSuccess ? "Email" : "Thank you!"}
        />
      </label>
      <button
        type="submit"
        className="focus:shadow-outline  w-full rounded-full bg-[#8C2F00] py-2 px-4 font-bold text-white hover:bg-red-700 focus:outline-none"
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
  );
}

function Menu() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <div className="fixed top-10 right-10 z-30 flex flex-row rounded-lg bg-[#f0631c] p-4">
        <a target="_blank" href="https://twitter.com/attoworkshops">
          <AiOutlineTwitter className="h-8 w-8 transform pr-2 text-white transition duration-100 hover:scale-110" />
        </a>
        <a target="_blank" href="https://instagram.com/attoworkshops">
          <AiOutlineInstagram className="h-8 w-8 transform pr-2 text-white transition duration-100 hover:scale-110" />
        </a>
        <RxHamburgerMenu
          onClick={() => setMenuVisible(!menuVisible)}
          className={
            "h-8 w-8 transform text-white transition duration-100 hover:scale-110 " +
            (menuVisible ? "rotate-90 " : "")
          }
        />
      </div>
      <div
        className={`${
          menuVisible ? "translate-x-0" : "translate-x-full"
        } fixed top-36 right-6 z-30 h-full w-64 transform p-4 transition-transform duration-500`}
      >
        {menuVisible && (
          <nav className="z-40 grid rounded-lg bg-[#f0631c] text-2xl text-white shadow-lg">
            <Link href="/apply" className="mr-4  grid-cols-1 p-2 ">
              Apply
            </Link>
            <a href="#workshops" className="mr-4  grid-cols-1 p-2 ">
              Workshops
            </a>
            <a href="#what-we-do" className="mr-4  grid-cols-1 p-2 ">
              What we do
            </a>
            <a href="#testimonials" className="mr-4  grid-cols-1 p-2 ">
              Testimonials
            </a>
            <Link href={"/contactus"} className="mr-4  grid-cols-1 p-2 ">
              Contact us
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AttoPage>
      <Menu />
      <div id="home">
        <div className="min-h-screen w-full bg-[#FF955F] text-[#8C2F00] bellow-xl:object-center bellow-xl:text-center">
          <div className="relative top-0 w-full bg-gray-500 over-sm:h-64 bellow-sm:h-52 ">
            <div className="h-full w-full">
              <Image
                src={workshopBannerImage}
                alt="Picture of workshop"
                style={{ objectFit: "cover" }}
                priority
                fill
              />
            </div>
          </div>

          <div
            style={{
              height: "100%",
            }}
            className="grid w-full gap-4 over-xl:grid-flow-col over-xl:px-20 over-xl:pl-40 bellow-xl:grid-flow-row"
          >
            <div className="px-16 py-10 text-3xl text-[#8C2F00] bellow-sm:p-16">
              <div>
                <h1>Acting workshops with the UK&apos;s leading directors</h1>
                <div className="h-5" />
                <Link
                  className="rounded-full bg-[#8C2F00] px-5 py-3 text-4xl font-bold text-gray-100 hover:bg-[#e64d00]"
                  href={"/apply"}
                >
                  Apply
                </Link>
              </div>
            </div>

            <div className="w-full place-content-center over-xl:pt-40">
              <Image
                className="mx-auto bellow-lg:w-full"
                alt="Atto logo"
                src={attoLogo}
                priority
                style={{
                  maxWidth: "500px",
                }}
              />
            </div>

            <div className="bellow-xl:w-full bellow-xl:object-center bellow-xl:pt-5">
              <a target="_blank" href={"http://www.downside-fisher.org/"}>
                <div className="bottom-16 left-16 text-xl over-xl:absolute over-xl:left-52 bellow-xl:pb-10">
                  atto supports
                  <div className="mx-auto max-w-sm">
                    <Image
                      className="mx-auto transform transition duration-100 hover:scale-110 "
                      alt="DFYC logo"
                      src={dfycLogo}
                      style={{
                        width: "50%",
                        maxWidth: "100px",
                      }}
                      priority
                    />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="workshops">
        <div className="min-h-screen w-full bg-white text-[#8C2F00] ">
          <div className="p-10 ">
            <div className="flex h-full flex-col">
              <h1 className="mb-10 text-center text-3xl">Workshops</h1>
              <div className="my-auto mx-auto mb-20 rounded-lg bg-[#FF955F] p-10 text-center text-2xl text-white">
                <div className="flex flex-wrap justify-center over-lg:flex-row bellow-lg:flex-col">
                  {workshops.map((w, i) => (
                    <WorkshopCard key={i} workshop={w} />
                  ))}
                </div>
                <div className="mt-5 ">
                  <Link
                    className="rounded-full bg-[#8C2F00] px-5 py-3 text-4xl font-bold text-gray-100 hover:bg-[#e64d00]"
                    href={"/apply"}
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="what-we-do">
        <div className="min-h-screen w-full bg-[#FF955F] text-[#8C2F00]">
          <div className="p-10 ">
            <div className="my-auto">
              <h1 className="pb-5 text-center text-3xl">What we do</h1>
              <div className="mx-auto flex flex-row rounded-lg bg-white text-xl over-lg:max-w-5xl bellow-lg:flex-col ">
                <div className="flex w-full flex-col p-5 over-md:pr-10">
                  <div className="flex h-full flex-row">
                    <div className="my-auto">
                      <p className="py-2 text-2xl">
                        Professional actors with professional directors
                      </p>
                      <p className="py-2">
                        On Saturdays professional actors of all ages are welcome
                        to take part in our drop-in scene studies. Our aim is to
                        create a truly safe space to fail, succeed, learn & work
                        on that craft with the guidance of leading directors.
                      </p>
                      <p className="py-2">
                        Workshops will take place at Downside Fisher Youth Club,
                        Coxson Place, Druid Street, London, SE1 2EZ. A 10 minute
                        walk from London Bridge Station.
                      </p>
                      <p className="py-2">
                        Workshops help support the running of the Downside
                        Fisher Youth Club who help socially excluded children &
                        young people from Bermondsey & its neighbouring areas.
                      </p>
                    </div>
                  </div>
                  <Link
                    className="rounded-full bg-[#8C2F00] px-4 py-2 text-center align-bottom font-bold text-gray-100 hover:bg-[#e64d00]"
                    href={"/apply"}
                  >
                    Apply
                  </Link>
                </div>
                <div className="relative inline-block w-full">
                  <Image
                    src={whatWeDoImage}
                    alt="Workshop picture"
                    className="block h-full w-full over-lg:rounded-r bellow-lg:rounded-b"
                    style={{ objectFit: "cover" }}
                  />

                  <div
                    style={{
                      WebkitTransform: "translateX(50%) translateY(-50%)",
                    }}
                    className="absolute top-1/2 right-1/2"
                  >
                    <a target="_blank" href="https://vimeo.com/820843498">
                      <AiOutlinePlayCircle className="h-28 w-28 transform pr-2 text-white transition duration-100 hover:scale-105 hover:text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="testimonials">
        <div className="min-h-screen w-full bg-white text-[#8C2F00] ">
          <div className="p-10 ">
            <div className="h-full">
              <h1 className="mb-10 text-center text-3xl">Testimonials</h1>
              <div className="mx-auto mb-20 rounded-lg bg-[#FF955F] p-5 text-xl text-white over-lg:max-w-5xl">
                <div className="above-md:flex-row flex bellow-md:flex-col">
                  <div className="p-2">
                    <Image
                      priority
                      alt="Ayo"
                      src="/small/workshop/ayo_small.png"
                      width={816}
                      height={642}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="my-auto items-center justify-center p-5">
                    “I really loved the workshop because I learned something new
                    that was very effective I will take with me for the rest of
                    my acting career”
                    <p className="text-right">- Ayo</p>
                  </div>
                </div>

                <div className="above-md:flex-row flex bellow-md:flex-col ">
                  <div className="my-auto items-center justify-center p-5">
                    “An engaging and informative 2 hours, learning from a highly
                    skilled director”
                    <div className="text-right">- Ella Dorman-Gajic</div>
                  </div>
                  <div className="p-2 bellow-md:order-first">
                    <Image
                      priority
                      alt="Ayo"
                      src="/small/workshop/ella_small.png"
                      width={892}
                      height={664}
                      className="rounded-lg "
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="mx-auto mb-20 rounded-lg bg-[#FF955F] p-5 text-xl text-white over-lg:max-w-5xl">
                <h1 className="pb-5 text-center text-3xl">
                  Other participants
                </h1>
                <div className="flex over-xl:flex-row bellow-xl:flex-col">
                  <div className="max-w-lg over-xl:pr-5">
                    <div className="py-5">
                      “Great! Fun location and very inclusive”
                    </div>
                    <div className="py-5">
                      “I liked that I didn’t feel pressure or nervous in the
                      room, the director was friendly and communicative, easy to
                      talk to and discuss where to go with the text”
                    </div>
                    <div className="py-5">
                      “I learnt about the importance of punctuation!”
                    </div>

                    <div className="flex w-full  flex-col py-5">
                      <Link
                        className="rounded-full bg-[#8C2F00] px-4 py-2 text-center align-bottom font-bold text-gray-100 hover:bg-[#e64d00]"
                        href="/apply"
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                  <div
                    className="mx-auto"
                    style={{
                      maxWidth: "500px",
                    }}
                  >
                    <Carousel
                      renderArrowPrev={(
                        onClickHandler: () => void,
                        hasPrev: boolean,
                        label: string
                      ) => (
                        <button
                          type="button"
                          aria-label={label}
                          className="control-arrow control-prev rounded-l-lg"
                          onClick={onClickHandler}
                        />
                      )}
                      renderArrowNext={(
                        onClickHandler: () => void,
                        hasNext: boolean,
                        label: string
                      ) => (
                        <button
                          type="button"
                          aria-label={label}
                          className="control-arrow control-next rounded-r-lg"
                          onClick={onClickHandler}
                        />
                      )}
                      autoPlay={true}
                      infiniteLoop={true}
                      showStatus={false}
                      showArrows={true}
                      showThumbs={false}
                    >
                      {caruselData.map((v, i) => (
                        <div key={i}>
                          <Image
                            className="rounded-lg"
                            priority
                            src={v.image}
                            alt={v.imageAlt}
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="news-letter" className=" w-full bg-[#FF955F]">
        <div className="p-10 text-[#8C2F00]">
          <div className="flex h-full flex-col items-center">
            <div className="flex flex-row">
              <a target="_blank" href="https://twitter.com/attoworkshops">
                <AiOutlineTwitter className="h-10 w-10 transform pr-2 transition duration-100 hover:scale-110" />
              </a>
              <a target="_blank" href="https://instagram.com/attoworkshops">
                <AiOutlineInstagram className="h-10 w-10 transform pr-2 transition duration-100 hover:scale-110" />
              </a>
              <a
                target="_blank"
                href="mailto://info@attoworkshops.com"
                className="flex flex-row"
              >
                <AiOutlineMail className="h-10 w-10 transform pr-2 transition duration-100 hover:scale-110" />
                <p className="pt-2">info@attoworkshops.com</p>
              </a>
            </div>
            <h1 className="text-center text-3xl">
              Subscribe to our news letter
            </h1>

            <div className="w-full max-w-xl pb-2">
              <NewsLetterSignup />
            </div>
          </div>
        </div>
      </div>
    </AttoPage>
  );
}
