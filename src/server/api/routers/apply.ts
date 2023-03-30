import { newApplication } from "lib/db/application";
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
            // workshop: z.nativeEnum(WorkshopTypes),
            credits: z.string(),
            emailPreference: z.boolean(),
        }))
        .mutation(async ({ input }: NewApplicationProps) => {
            console.log('inserting: ', input)

            const insertedID = await newApplication(input)
            console.log(insertedID)
        }),
});
