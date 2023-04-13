import { newContactus } from "lib/db/contactus";
import sendContactusReceipt from "lib/email/contactus";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type ContactUs = {
    name: string
    email: string
    pronouns: string
    message: string
}

type NewcontactusProps = {
    input: ContactUs
}

export const contactFormsRouter = createTRPCRouter({
    new: publicProcedure
        .input(z.object({
            name: z.string(),
            email: z.string().email(),
            pronouns: z.string(),
            message: z.string(),
        }))
        .mutation(async ({ input }: NewcontactusProps) => {
            console.log('new contact me form', input)
            const dbInsertionResult = await newContactus(input)
            console.log('db insertion result', dbInsertionResult)

            const emailResult = await sendContactusReceipt(input)
            console.log('email sent', emailResult)
        }),
});
