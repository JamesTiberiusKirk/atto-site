import { newContactus } from "lib/db/contactus";
import sendContactusReceipt from "lib/email/contactus";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type ContactUs = {
  name: string;
  email: string;
  pronouns: string;
  message: string;
};

type NewcontactusProps = {
  input: ContactUs;
};

export const contactFormsRouter = createTRPCRouter({
  new: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        pronouns: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }: NewcontactusProps) => {
      console.log("new contact me form", input);

      const [dbInsertionResult, emailResult] = await Promise.all([
        newContactus(input),
        sendContactusReceipt(input),
      ]);

      if (dbInsertionResult?.error) {
        console.error("error inserting record: ", dbInsertionResult.error);
        return;
      }
      if (emailResult?.error) {
        console.error("error inserting: ", emailResult.error);
        return;
      }

      console.log("db insertion result", dbInsertionResult?.data);
      console.log("email sent", emailResult.data);
    }),
});
