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
            workshop: z.string(),
            credits: z.string(),
            emailPreference: z.boolean(),
        }))
        .mutation(async ({ input }: NewApplicationProps) => {
            console.log('inserting: ', input)

            const insert = await newApplication(input)
            console.log('Inserted application: ', insert)

            const emailResponse = await sendApplicationReceipt(input)
            console.log('Email sent', emailResponse)

            if (input.emailPreference) {
                const newsSubscriptionInsertion = await newNewsSubscription(input.email)
                console.log('Inserted news subscription', newsSubscriptionInsertion)
            }
        }),
});
