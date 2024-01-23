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
import Link from "next/link";

type AdminProps = {
  user: LoginRequest;
  applications: Application[];
  subscriptions: string[];
  contactUsRequests: ContactUs[];
};

export default function Admin(props: AdminProps) {
  return (
    <AttoPage>
      <div className="flex min-h-screen flex-col items-center whitespace-pre-line bg-[#FF955F] px-4 py-16">
        <div className="inline-flex">
          <h1 className="text-3xl text-white">Admin: {props.user.email}</h1>
        </div>
        <div className="max-w-2/3 inline rounded-lg bg-white p-5">
            <a href="/admin/selfupdate" className="text-md m-2 flex w-fit flex-row rounded-full bg-[#8C2F00] px-3 py-1 font-bold text-gray-100 hover:bg-[#e64d00]">Self Update</a>
          <div className="flex flex-row  pt-3 pl-3">
            <h1 className="text-2xl">Applications</h1>
            <div className="flex w-full flex-row">
              <div className="w-full"></div>
              <Link
                href="/api/csv/applications"
                className="text-md m-2 flex w-fit flex-row rounded-full bg-[#8C2F00] px-3 py-1 font-bold text-gray-100 hover:bg-[#e64d00]"
              >
                CSV
                <div className="w-1"></div>
                <BsCloudDownload className="m-" />
              </Link>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <td className="border px-4 py-2">
                  <b>Name</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Email</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Credits</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Pronouns</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Phone Number</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Workshops</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Email preference</b>
                </td>
                <td className="border px-4 py-2">
                  <b>Referree</b>
                </td>
              </tr>
            </thead>
            <tbody>
              {props.applications && props.applications.length > 0 ? (
                props.applications.map((a, k) => (
                  <tr key={k}>
                    <td className="border px-4 py-2">{a.name}</td>
                    <td className="border px-4 py-2">{a.email}</td>
                    <td className="border px-4 py-2">{a.credits}</td>
                    <td className="border px-4 py-2">{a.pronouns}</td>
                    <td className="border px-4 py-2">{a.phoneNumber}</td>
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
                    <td className="border px-4 py-2">
                      {a.referee !== undefined ? (
                        <>
                          <b>Name: </b>
                          {a.referee?.name}
                          <br />
                          <b>Pronouns: </b>
                          {a.referee?.pronouns}
                          <br />
                          <b>Email: </b>
                          {a.referee?.email}
                          <br />
                          <b>Phrone Number: </b>
                          {a.referee?.phoneNumber}
                          <br />
                        </>
                      ) : (
                        <>None</>
                      )}
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
            <div className="flex w-full flex-row">
              <div className="w-full"></div>
              <Link
                href="/api/csv/contact_requests"
                className="text-md m-2 flex w-fit flex-row rounded-full bg-[#8C2F00] px-3 py-1 font-bold text-gray-100 hover:bg-[#e64d00]"
              >
                CSV
                <div className="w-1"></div>
                <BsCloudDownload className="m-" />
              </Link>
            </div>
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
              {props.contactUsRequests && props.contactUsRequests.length > 0 ? (
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
            <div className="flex w-full flex-row">
              <div className="w-full"></div>
              <Link
                href="/api/csv/subscriptions"
                className="text-md m-2 flex w-fit flex-row rounded-full bg-[#8C2F00] px-3 py-1 font-bold text-gray-100 hover:bg-[#e64d00]"
              >
                CSV
                <div className="w-1"></div>
                <BsCloudDownload className="m-" />
              </Link>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <td className="border px-4 py-2">Email</td>
              </tr>
            </thead>
            <tbody>
              {props.subscriptions && props.subscriptions.length > 0 ? (
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
