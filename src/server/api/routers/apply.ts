import { newApplication } from "lib/db/application";
import { newNewsSubscription } from "lib/db/subscriptions";
import { GenerateApplicationAdminEmailString } from "lib/email/admin";
import sendApplicationReceipt from "lib/email/application";
import sendEmail from "lib/email/send";
import type { Application } from "types/application";
import { ApplicationSchema } from "types/application";
import type { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type NewApplicationProps = {
  input: z.infer<typeof ApplicationSchema>;
};

export const applicationRouter = createTRPCRouter({
  new: publicProcedure
    .input(ApplicationSchema)
    .mutation(async ({ input }: NewApplicationProps) => {
      console.log("New application: ", input);

      const adminEmails = env.ADMIN_EMAILS.split(",");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adminEmailPromises: Promise<any>[] = [];
      adminEmails.forEach((e) => {
        adminEmailPromises.push(
          sendEmail(
            e,
            GenerateApplicationAdminEmailString(input as Application)
          )
        );
      });

      const [insertRes, emailResponse] = await Promise.all([
        newApplication(input as Application),
        sendApplicationReceipt(input as Application),
        ...adminEmailPromises,
      ]);

      if (insertRes?.error) {
        console.error("Error inserting application record: ", insertRes.error);
        return;
      }
      if (emailResponse.error) {
        console.error(
          "Error sending application receipt: ",
          emailResponse.error
        );
        return;
      }

      console.log("Inserted new application: ", insertRes?.data);
      console.log("Sent application receipt: ", emailResponse.data);

      if (!input.emailPreference) {
        const newNewsSubscriptionRes = await newNewsSubscription(input.email);
        if (newNewsSubscriptionRes?.error) {
          console.error(
            "Error inserting email subscription record: ",
            newNewsSubscriptionRes.error
          );
          return;
        }

        console.log(
          "Inserted new email subscription record: ",
          newNewsSubscriptionRes?.data
        );
      }
    }),
});
