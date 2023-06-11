import { withSessionSsr } from "lib/auth/withSession";
import { getAllApplicationsInPast } from "lib/db/application";
import type { Application } from "types/application";
import type { LoginRequest } from "types/loginRequests";
import AttoPage from "~/components/page";

type AdminProps = {
  user: LoginRequest;
  applications: Application[];
};
export default function Admin(props: AdminProps) {
  return (
    <AttoPage>
      <div className="flex min-h-screen flex-col items-center bg-[#FF955F] px-4 py-16">
        <div className="inline-flex">
          <h1 className="text-2xl text-white ">Admin: {props.user.email}</h1>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <td className="px-4 py-2">Name</td>
              <td className="px-4 py-2">Email</td>
              <td className="px-4 py-2">Credits</td>
              <td className="px-4 py-2">Pronouns</td>
              <td className="px-4 py-2">Workshops</td>
              <td className="px-4 py-2">Email preference</td>
            </tr>
          </thead>
          {props.applications.map((a, k) => (
            <tr key={k}>
              <td className="border px-4 py-2">{a.name}</td>
              <td className="border px-4 py-2">{a.email}</td>
              <td className="border px-4 py-2">{a.credits}</td>
              <td className="border px-4 py-2">{a.pronouns}</td>
              <td className="border px-4 py-2">
                {a.workshops.map((w, k) => (
                  <span key={k}>{w}, </span>
                ))}
              </td>
              <td className="border px-4 py-2">
                {a.emailPreference ? "opt in" : "opt out"}
              </td>
            </tr>
          ))}
        </table>
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
      } as AdminProps,
    };

    const applications = await getAllApplicationsInPast();
    if (applications.error && !applications.data) {
      return r;
    }

    r.props.applications = applications.data as Application[];

    return r;
  }
);
