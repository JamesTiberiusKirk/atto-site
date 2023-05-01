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
            console.log('inserting: ', input)

            newApplication(input).then(insert => {
                console.log('Inserted application: ', insert)
            }).catch(err => {
                console.error('error inserting application: ', err)
            })

            sendApplicationReceipt(input).then(emailResponse => {
                console.log('Email sent', emailResponse)
            }).catch(err => {
                console.error('error sending email', err)
            })

            if (input.emailPreference) {
                newNewsSubscription(input.email).then(newNewsSubscription => {
                    console.log('Inserted news subscription', newNewsSubscription)
                }).catch(err => {
                    console.log('error inserting news subscription', err)
                })
            }
        }),
});
