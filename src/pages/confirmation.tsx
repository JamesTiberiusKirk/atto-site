import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import AttoPage from "~/components/page";

export default function Confirmation() {
  const router = useRouter();
  const t = router.query["t"];

  const content = `Thank you for your ${
    t === "appl" ? "application" : "message"
  } to `;

  return (
    <AttoPage>
      <div className="min-h-screen bg-[#FF955F] px-4 py-16  text-center ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white bellow-sm:text-4xl sm:text-[5rem]">
          {content}
          <br />
          <span className="text-6xl text-green-800 bellow-sm:text-5xl sm:text-[5rem]">
            atto{" "}
          </span>
          workshops
        </h1>
        <div className="w-full place-content-center pt-32 over-xl:py-16">
          <Link href="/">
            <Image
              className="mx-auto object-center"
              alt="Atto logo"
              width={1890 / 3}
              height={1417 / 3}
              src="/logo_with_name.png"
            />
          </Link>
        </div>
      </div>
    </AttoPage>
  );
}
