import { newApplication } from "lib/db/application";
import sendApplicationReceipt from "lib/email/application";
import { Application } from "types/application";
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

            const p = await Promise.all([
                newApplication(input),
                sendApplicationReceipt(input)
            ])

            const insertedID = p[0]
            console.log('Inserted: ', insertedID)

            const emailResponse = p[1]
            // This wount actually validate weather the email was sent or not
            console.log(emailResponse)
            // emailResponse.response.status == 200 ?
            //     console.log('Email sent: ', input.email) :
            //     console.error('Email send error: ', input.email)
        }),
});
