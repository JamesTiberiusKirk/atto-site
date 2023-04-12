import { newNewsSubscription } from "lib/db/newNewsLetterSubscription";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type NewNewsLetterProps = {
    input: string
}

export const newsLetterRouter = createTRPCRouter({
    new: publicProcedure
        .input(z.string().email())
        .mutation(async ({ input }: NewNewsLetterProps) => {
            console.log('new subscriber to the news letter: ', input)

            const insertedID = await newNewsSubscription(input)
            console.log('Inserted: ', insertedID)
        }),
});
