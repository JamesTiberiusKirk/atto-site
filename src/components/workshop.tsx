import Image from "next/image";
import { Workshop } from "types/workshop";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";


export type WorkshopsCardProps ={
  workshops: Workshop[]
}

export function WorkshopsCard({workshops}:WorkshopsCardProps){
  return (
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
  )
}

export type WorkshopCardProps = {
  workshop: Workshop;
};

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <div className="m-5 min-w-fit">
      <div className="flex flex-col items-center text-center">
        {workshop.imgPath ? (
          <div className="h-40 w-40 transform overflow-hidden rounded-full transition duration-100 hover:scale-110">
            <Link href={"/apply?opt=" + workshop.key}>
              <Image src={workshop.imgPath}
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
            {typeof workshop.desc === "object" && workshop.desc.map((d, i) => (
              <span key={i}>
                {d}
                <br />
              </span>
            ))}
            {typeof workshop.desc === "string" && (
            <span dangerouslySetInnerHTML={{__html:workshop.desc.replaceAll("\n","<br/>")}} >
            </span>
            )}
          </p>
        </div>

        <p className="mt-2 text-sm text-white">
          <span dangerouslySetInnerHTML={{ __html: workshop.type.replaceAll("\n","<br/>") }} /> <br />
          {workshop.date} <br />
          {workshop.time} <br />
        </p>

        <p className="mt-2 text-sm text-white">{workshop.price}</p>
      </div>
    </div>
  );
}
