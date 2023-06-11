import { withSessionSsr } from "lib/auth/withSession";

export default function AdminHome() {
  return (
    <>
      <h1>Admin Page</h1>
    </>
  );
}

export const getServerSideProps = withSessionSsr(function getServerSideProps({
  req,
}) {
  const user = req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: "/admin/unauthorised",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
});
