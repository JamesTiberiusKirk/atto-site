import { createTRPCRouter } from "~/server/api/trpc";
import { contactFormsRouter } from "./routers/contactus";
import { applicationRouter } from "./routers/apply";
import { newsLetterRouter } from "./routers/newsletter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    contactus: contactFormsRouter,
    apply: applicationRouter,
    newsLetter: newsLetterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
