import { newNewsSubscription, removeNewsSubscription } from "lib/db/subscriptions";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type NewNewsLetterProps = {
    input: string
}

export const newsLetterRouter = createTRPCRouter({
    new: publicProcedure.input(z.string().email())
        .mutation(async ({ input }: NewNewsLetterProps) => {
            console.log('new subscriber to the news letter: ', input)

            const inserted = await newNewsSubscription(input)
            console.log('Inserted: ', inserted)
        }),
    delete: publicProcedure.input(z.string().email())
        .mutation(async ({ input }: NewNewsLetterProps) => {
            console.log('unsubscribing from the news letter: ', input)

            const inserted = await removeNewsSubscription(input)
            if (inserted?.value) {
                console.log('Removed: ', inserted.value._id)
            } else {
                console.log('Nothing to remove')
            }
        }),

});
