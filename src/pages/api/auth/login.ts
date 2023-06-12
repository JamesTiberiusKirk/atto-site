import { login } from "lib/auth/login";
import { withSessionRoute } from "lib/auth/withSession";

export default withSessionRoute(async function loginRoute(req, res) {
  // get user from database then:
  const token = req.query["token"];
  if (!token || typeof token !== "string") return {};

  const [loginRequest, error] = await login(token);
  if (error || !loginRequest) return res.redirect("/admin/unatuhorised");

  req.session.user = loginRequest;
  await req.session.save();
  res.redirect("/admin");
});
