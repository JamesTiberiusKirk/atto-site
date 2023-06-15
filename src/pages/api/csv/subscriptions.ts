import { withSessionRoute } from "lib/auth/withSession";
import { getAllNewsSubscriptionInPast } from "lib/db/subscriptions";
import ObjectsToCsv from "objects-to-csv";

export default withSessionRoute(async function contactRequests(req, res) {
  const user = req.session.user;
  if (!user) {
    res.redirect("/admin/unauthorised");
  }

  const subscriptions = await getAllNewsSubscriptionInPast();
  if (subscriptions.error || !subscriptions.data) {
    res.status(500);
    return;
  }

  const csv = new ObjectsToCsv(
    subscriptions.data.map((e) => ({
      email: e,
    }))
  );
  const date = new Date();
  const filename = `subscriptions-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  return res.send(await csv.toString());
});
