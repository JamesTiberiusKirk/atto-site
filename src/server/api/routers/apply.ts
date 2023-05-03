import { newApplication } from "lib/db/application";
import { newNewsSubscription } from "lib/db/subscriptions";
import sendApplicationReceipt from "lib/email/application";
import type { Application } from "types/application";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type NewApplicationProps = {
    input: Application
}

export const applicationRouter = createTRPCRouter({
    new: publicProcedure
        .input(z.object({
            name: z.string(),
            email: z.string().email(),
            pronouns: z.string(),
            workshops: z.string().array(),
            credits: z.string(),
            emailPreference: z.boolean(),
        }))
        .mutation(async ({ input }: NewApplicationProps) => {
            console.log('New application: ', input)

            const [insertRes, emailResponse] = await Promise.all([
                newApplication(input),
                sendApplicationReceipt(input),
            ])

            if (insertRes?.error) {
                console.error('Error inserting application record: ', insertRes.error)
            }
            if (emailResponse.error) {
                console.error('Error sending application receipt: ', emailResponse.error)
            }

            console.log('Inserted new application: ', insertRes?.data)
            console.log('Sent application receipt: ', emailResponse.data)

            if (input.emailPreference) {
                const newNewsSubscriptionRes = await newNewsSubscription(input.email)
                if (newNewsSubscriptionRes?.error) {
                    console.error('Error inserting email subscription record: ', newNewsSubscriptionRes.error)
                }

                console.log('Inserted new email subscription record: ', newNewsSubscriptionRes?.data)
            }
        }),
});
