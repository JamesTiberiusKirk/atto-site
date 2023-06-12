import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  MONGODB_URI: z.string(),
  MONGO_URL: z.string(),
  MONGO_DB_APPLICATION_COLLECTION: z.string(),
  MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION: z.string(),
  MONGO_DB_CONTACTS_COLLECTION: z.string(),
  MONGO_DB_LOGIN_COLLECTION: z.string(),
  MJ_APIKEY_PUBLIC: z.string(),
  MJ_APIKEY_PRIVATE: z.string(),
  MJ_SENDER_EMAIL: z.string(),
  MJ_SENDER_NAME: z.string(),
  ADMIN_EMAILS: z.string(),
  HOST: z.string(),
  LOGIN_EXPIRY: z.string().transform(Number),
  // SESSION_SECRET: z.string().min(32).max(32),
  SESSION_SECRET: z.string(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_DB_APPLICATION_COLLECTION: process.env.MONGO_DB_APPLICATION_COLLECTION,
  MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION:
    process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION,
  MONGO_DB_CONTACTS_COLLECTION: process.env.MONGO_DB_CONTACTS_COLLECTION,
  MONGO_DB_LOGIN_COLLECTION: process.env.MONGO_DB_LOGIN_COLLECTION,
  MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE,
  MJ_SENDER_EMAIL: process.env.MJ_SENDER_EMAIL,
  MJ_SENDER_NAME: process.env.MJ_SENDER_NAME,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  HOST: process.env.HOST,
  LOGIN_EXPIRY: process.env.LOGIN_EXPIRY,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
