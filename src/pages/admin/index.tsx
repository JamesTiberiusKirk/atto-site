import { withSessionSsr } from "lib/auth/withSession";
import { getAllApplicationsInPast } from "lib/db/application";
import { getAllContactRequestInPast } from "lib/db/contactus";
import { getAllNewsSubscriptionInPast } from "lib/db/subscriptions";
import type { Application } from "types/application";
import type { LoginRequest } from "types/loginRequests";
import { getWorkshopByKey } from "types/workshop";
import AttoPage from "~/components/page";
import type { ContactUs } from "~/server/api/routers/contactus";
import { BsCloudDownload } from "react-icons/bs";
import { CSVLink } from "react-csv";
import Link from "next/link";

type AdminProps = {
  user: LoginRequest;
  applications: Application[];
  subscriptions: string[];
  contactUsRequests: ContactUs[];
};

export default function Admin(props: AdminProps) {
  // console.log(props);
  // const date = new Date();
  // const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  return (
    <AttoPage>
      <div className="flex min-h-screen flex-col items-center whitespace-pre-line bg-[#FF955F] px-4 py-16">
        <div className="inline-flex">
          <h1 className="text-3xl text-white ">Admin: {props.user.email}</h1>
        </div>
        <div className="max-w-2/3 inline rounded-lg bg-white p-5">
          <div className="pt-3 pl-3">
            <h1 className="text-2xl">Applications</h1>
            {/* <Link href="/api/csv/applications"> */}
            {/*   <BsCloudDownload className="flex items-end" /> */}
            {/*   Download CSV */}
            {/* </Link> */}
          </div>
          <table>
            <thead>
              <tr>
                <td className="border px-4 py-2">Name</td>
                <td className="border px-4 py-2">Email</td>
                <td className="border px-4 py-2">Credits</td>
                <td className="border px-4 py-2">Pronouns</td>
                <td className="border px-4 py-2">Workshops</td>
                <td className="border px-4 py-2">Email preference</td>
              </tr>
            </thead>
            <tbody>
              {props.applications ? (
                props.applications.map((a, k) => (
                  <tr key={k}>
                    <td className="border px-4 py-2">{a.name}</td>
                    <td className="border px-4 py-2">{a.email}</td>
                    <td className="border px-4 py-2">{a.credits}</td>
                    <td className="border px-4 py-2">{a.pronouns}</td>
                    <td className="border px-4 py-2">
                      {a.workshops.map((w, k) => (
                        <span key={k}>
                          {getWorkshopByKey(w)?.instructorName}
                          {k < a.workshops.length && <br />}
                        </span>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {a.emailPreference ? "opt in" : "opt out"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border px-4 py-2 text-center">
                    No Applications
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="border-b p-5"></div>

          <div className="pt-3 pl-3">
            <h1 className="text-2xl">Contact Requests</h1>
            {/* <CSVLink */}
            {/*   data={props.contactUsRequests} */}
            {/*   filename={`contact-us-requests-${dateString}.csv`} */}
            {/* > */}
            {/*   <BsCloudDownload className="flex items-end" /> */}
            {/*   Download CSV */}
            {/* </CSVLink> */}
          </div>
          <table>
            <thead>
              <tr>
                <td className="border px-4 py-2">Name</td>
                <td className="border px-4 py-2">Email</td>
                <td className="border px-4 py-2">Pronouns</td>
                <td className="border px-4 py-2">Message</td>
              </tr>
            </thead>
            <tbody>
              {props.contactUsRequests ? (
                props.contactUsRequests.map((c, k) => (
                  <tr key={k}>
                    <td className="border px-4 py-2">{c.name}</td>
                    <td className="border px-4 py-2">{c.email}</td>
                    <td className="border px-4 py-2">{c.pronouns}</td>
                    <td className="border px-4 py-2">{c.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border px-4 py-2 text-center">
                    No Contact Requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="border-b p-5"></div>

          <div className="pt-3 pl-3">
            <h1 className="text-2xl">Subscriptions</h1>
          </div>
          <table>
            <thead>
              <tr>
                <td className="border px-4 py-2">Email</td>
              </tr>
            </thead>
            <tbody>
              {props.subscriptions ? (
                props.subscriptions.map((a, k) => (
                  <tr key={k}>
                    <td className="border px-4 py-2">{a}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2">No Subscriptions</td>
                </tr>
              )}
            </tbody>
          </table>
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
      } as AdminProps,
    };

    const [applications, contactUsRequests, subscriptions] = await Promise.all([
      getAllApplicationsInPast(),
      getAllContactRequestInPast(),
      getAllNewsSubscriptionInPast(),
    ]);

    if (
      (applications.error && !applications.data) ||
      (contactUsRequests.error && !contactUsRequests.data) ||
      (subscriptions.error && !subscriptions.data)
    ) {
      return r;
    }

    r.props.applications = applications.data as Application[];
    r.props.contactUsRequests = contactUsRequests.data as ContactUs[];
    r.props.subscriptions = subscriptions.data as string[];

    return r;
  }
);
