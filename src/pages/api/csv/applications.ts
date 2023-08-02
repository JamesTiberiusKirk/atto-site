import { withSessionRoute } from "lib/auth/withSession";
import { getAllApplicationsInPast } from "lib/db/application";
import ObjectsToCsv from "objects-to-csv";

export default withSessionRoute(async function application(req, res) {
  const user = req.session.user;
  if (!user) {
    res.redirect("/admin/unauthorised");
  }

  const applications = await getAllApplicationsInPast();
  if (applications.error || !applications.data) {
    res.status(500);
    return;
  }

  const data = applications.data.map((a) => {
    return {
      name: a.name,
      email: a.email,
      pronouns: a.pronouns,
      phoneNumber: a.phoneNumber,
      workshops: a.workshops,
      credits: a.credits,
      emailPreference: a.emailPreference,
      refereeName: a.referee?.name,
      refereeEmail: a.referee?.email,
      refereePronouns: a.referee?.pronouns,
      refereePhoneNumber: a.referee?.phoneNumber,
    };
  });
  const csv = new ObjectsToCsv(data);
  const date = new Date();
  const filename = `applications-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  return res.send(await csv.toString());
});
