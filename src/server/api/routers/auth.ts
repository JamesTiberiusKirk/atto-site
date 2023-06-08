import sendEmail from "lib/email/send";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type AuthRouterProps = {
  input: {
    email: string;
  };
};
export const authRouter = createTRPCRouter({
  new: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }: AuthRouterProps) => {
      const res = await sendEmail(input.email, "");
      console.log(res);
    }),
});
