import { newApplication } from "lib/db/application";
import { newNewsSubscription } from "lib/db/subscriptions";
import sendApplicationReceipt from "lib/email/application";
import type { Application } from "types/application";
import { ApplicationSchema } from "types/application";
import type { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type NewApplicationProps = {
  input: z.infer<typeof ApplicationSchema>;
};

export const applicationRouter = createTRPCRouter({
  new: publicProcedure
    .input(ApplicationSchema)
    .mutation(async ({ input }: NewApplicationProps) => {
      console.log("New application: ", input);

      const [insertRes, emailResponse] = await Promise.all([
        newApplication(input as Application),
        sendApplicationReceipt(input as Application),
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

/*
 
1. Argument of type '({ input }: NewApplicationProps) => Promise<void>' is not assignable to parameter of type '(opts: ResolveOptions<{ _config: RootConfig<{ ctx: {}; meta: object; errorShape: { data: { zodError: typeToFlattenedError<any, string> | null; code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | ... 9 more ... | "CLIENT_CLOSED_REQUEST"; httpStatus: number; path?: string | undefined; stack?: string | unde...'.
     Types of parameters '__0' and 'opts' are incompatible.
       Type 'ResolveOptions<{ _config: RootConfig<{ ctx: {}; meta: object; errorShape: { data: { zodError: typeToFlattenedError<any, string> | null; code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | ... 9 more ... | "CLIENT_CLOSED_REQUEST"; httpStatus: number; path?: string | undefined; stack?: string | undefined; ...' is not assignable to type 'NewApplicationProps'.
         The types of 'input.referee' are incompatible between these types.
           Type '{ name: string; email: string; pronouns: string; } | undefined' is not assignable to type 'Referee | undefined'.
             Property 'phoneNumber' is missing in type '{ name: string; email: string; pronouns: string; }' but required in type 'Referee'. [2345]


 */
