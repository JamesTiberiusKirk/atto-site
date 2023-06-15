import { withSessionRoute } from "lib/auth/withSession";
import { getAllContactRequestInPast } from "lib/db/contactus";
import ObjectsToCsv from "objects-to-csv";

export default withSessionRoute(async function contactRequests(req, res) {
  const user = req.session.user;
  if (!user) {
    res.redirect("/admin/unauthorised");
  }

  const contactRequests = await getAllContactRequestInPast();
  if (contactRequests.error || !contactRequests.data) {
    res.status(500);
    return;
  }

  const csv = new ObjectsToCsv(contactRequests.data);
  const date = new Date();
  const filename = `contact_requests-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  return res.send(await csv.toString());
});
