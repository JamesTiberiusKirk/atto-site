import { ObjectId } from "mongodb";
import type { ContactUs } from "~/server/api/routers/contactus";
import { connectToDatabase } from "./connect";

export async function newContactus(contactus: ContactUs) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_CONTACTS_COLLECTION || !db) return

    try {
        console.log('Inserting into collection', process.env.MONGO_DB_CONTACTS_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_CONTACTS_COLLECTION)
        const res = await collection.insertOne(contactus)

        return { data: res.insertedId }
    } catch (e) {
        return { error: e }
    }
}

export async function getAllContactRequestInPast(h: number) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_CONTACTS_COLLECTION || !db) return

    try {
        console.log(`Quering collection ${process.env.MONGO_DB_CONTACTS_COLLECTION} for any new records in the past ${h} hours`,)
        const collection = db.collection(process.env.MONGO_DB_CONTACTS_COLLECTION)
        const res = await collection.find<ContactUs>({
            _id: {
                $gt: ObjectId.createFromTime(Date.now() / 1000 - h * 60 * 60)
            }
        }).toArray()

        return { data: res }
    } catch (e) {
        return { error: e }
    }
}
