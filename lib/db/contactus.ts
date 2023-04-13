import type { ContactUs } from "~/server/api/routers/contactus";
import { connectToDatabase } from "./connect";

export async function newContactus(contactMe: ContactUs) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_CONTACTME_COLLECTION || !db) return

    try {
        console.log('inserting into collection', process.env.MONGO_DB_CONTACTME_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_CONTACTME_COLLECTION)
        const res = await collection.insertOne(contactMe)

        return res.insertedId
    } catch (e) {
        console.error(e)
    }
}
