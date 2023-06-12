import sendEmail from "lib/email/send";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import type { LoginRequest } from "types/loginRequests";
import { storeLoginRequest } from "lib/db/login";

type GetMagicLinkProps = {
  input: {
    email: string;
  };
};
export const authRouter = createTRPCRouter({
  getMagicLink: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }: GetMagicLinkProps) => {
      console.log(`Email ${input.email} attempting to login`);

      const emailList = env.ADMIN_EMAILS.split(",");
      if (!emailList.find((v) => v === input.email)) return;

      const loginReq = {
        email: input.email,
        tempPass: uuidv4().toString(),
      } as LoginRequest;
      const magicLink = `${env.HOST}api/auth/login?token=${loginReq.tempPass}`;

      const [emailResp, dbResp] = await Promise.all([
        sendEmail(loginReq.email, `${magicLink}`),
        storeLoginRequest(loginReq),
      ]);

      if (emailResp.error && emailResp.data?.Status !== "success") {
        console.error(emailResp.error);
      }

      if (dbResp.error) {
        console.error(dbResp.error);
      }

      console.log(emailResp, dbResp);
    }),
});
