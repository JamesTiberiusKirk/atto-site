import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import type { CarouselData, Testimonial } from "types/testimonial";



interface TestimonialProps{
  testimonial: Testimonial
  imgPos: "left" | "right"
}

function Testimonial({testimonial, imgPos}: TestimonialProps){
  const pos = imgPos === "left"?"over-md:order-first":"over-md:order-last"
  const imgConditional = testimonial.headshot? "":"w-2/3 object-contain"

  return (
    <div className="over-md:flex-row flex flex-col mt-10">
      <div className={`over-md:w-1/3 p-2 h-full ${pos}`}>
        <Image
          priority
          alt={testimonial.from}
          src={testimonial.headshot ? testimonial.headshot : "/headshots/placeholder.png"}
          width={500}
          height={500}
          className={'w-full rounded-lg over-md:max-h-48 mx-auto '+imgConditional}
        />
      </div>
      <div className="over-md:w-2/3 my-auto items-center p-5">
        “{testimonial.quote}”
        <p className="text-right">- {testimonial.from}</p>
      </div>
    </div>
  )
}

export interface TestimonialsPorops {
  testimonials: Testimonial[]
  carouselData: CarouselData
}

export default function Testimonials({testimonials, carouselData}:TestimonialsPorops){
  return (
    <div>
      <div className="min-h-screen w-full bg-white text-[#8C2F00] ">
        <div className="p-10">
          <div className="h-full">
            <h1 className="mb-10 text-center text-3xl">Testimonials</h1>
            <div className="mx-auto mb-20 rounded-lg bg-[#FF955F] p-5 text-xl text-white over-lg:max-w-5xl">
              {testimonials.map((t,i)=>(
                <span key={i}>
                  <Testimonial 
                    testimonial={t}
                    imgPos={ (i%2===0) ? "left" : "right" }
                  />
                </span>
              ))}
            </div>
          </div>

          <br />

          <div className="h-full">
            <div className="mx-auto mb-20 rounded-lg bg-[#FF955F] p-5 text-xl text-white over-md:max-w-5xl">
              <h1 className="pb-5 text-center text-3xl">
                Other participants
              </h1>
              <div className="mx-auto flex over-xl:flex-row bellow-xl:flex-col">
                <div className="mx-auto max-w-lg over-xl:pr-5">
                  {carouselData.quotes.map((quote)=>(
                  <div className="py-5">
                    “{quote}”
                  </div>
                  ))}
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
                  className="over-md:mx-auto"
                  style={{
                    maxWidth: "500px",
                  }}
                >
                  <Carousel
                    className="over-md:mx-auto"
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
                    {carouselData.pictures.map((v, i) => (
                      <div key={i}>
                        <Image
                          className="rounded-lg"
                          priority
                          width={500}
                          height={500}
                          src={v}
                          alt={"image"+i}
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
  )
}
