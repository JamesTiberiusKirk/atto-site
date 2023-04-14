import type { ContactUs } from "~/server/api/routers/contactus";
import { connectToDatabase } from "./connect";

export async function newContactus(contactus: ContactUs) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_CONTACTS_COLLECTION || !db) return

    try {
        console.log('Inserting into collection', process.env.MONGO_DB_CONTACTS_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_CONTACTS_COLLECTION)
        const res = await collection.insertOne(contactus)

        return res.insertedId
    } catch (e) {
        console.error(e)
    }
}
