import { login } from "lib/auth/login";
import { withSessionRoute } from "lib/auth/withSession";
import type { LoginRequest } from "types/loginRequests";
import { env } from "~/env.mjs";

export default withSessionRoute(async function loginRoute(req, res) {
  const token = req.query["token"];
  if (!token || typeof token !== "string") return {};

  if (env.NODE_ENV === "development" && token=== "1234") {
    const lr: LoginRequest = {
      email: "dev@mail.com",
      tempPass: "1234",
      expiresAt: 0,
      issuesAt: 0,
      loggedIn: true,
    }
    
    req.session.user = lr;
    await req.session.save();
    return res.redirect("/admin");
  }

  const [loginRequest, error] = await login(token);
  if (error || !loginRequest) return res.redirect("/admin/unatuhorised");

  req.session.user = loginRequest;
  await req.session.save();
  res.redirect("/admin");
});
