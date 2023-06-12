import AttoPage from "~/components/page";

export default function Unauthorised() {
  return (
    <AttoPage>
      <div className="flex min-h-screen flex-col items-center bg-[#FF955F] px-4 py-16">
        <div className="inline-flex">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Session has expired
          </h1>
        </div>
      </div>
    </AttoPage>
  );
}
