import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const workshopType = ['workshop_a', 'workshop_b', 'workshop_c'] as const

export const contactFormsRouter = createTRPCRouter({
    new: publicProcedure
        .input(z.object({
            name: z.string(),
            email: z.string().email(),
            pronouns: z.string(),
            workshop: z.enum(workshopType),
            credits: z.string(),
            emailPreference: z.boolean(),
        }))
        .mutation(({ input }) => {
            console.log(input)
        }),
});
