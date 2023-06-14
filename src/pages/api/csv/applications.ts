// import { withSessionRoute } from "lib/auth/withSession";
// import { getAllApplicationsInPast } from "lib/db/application";
// import ObjectsToCsv from "objects-to-csv";
//
// export default withSessionRoute(async function application(req, res) {
//   const user = req.session.user;
//   if (!user) {
//     res.redirect("/admin/unauthorised");
//   }
//
//   const applications = await getAllApplicationsInPast();
//   if (applications.error || !applications.data) {
//     res.status(500);
//     return;
//   }
//
//   const csv = new ObjectsToCsv(applications.data);
//   res.setHeader("Content-Type", "text/csv");
//   console.log(await csv.toString());
//
//   res.attachment("test.csv");
//   return res.send(await csv.toString());
// });
