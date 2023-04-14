import type { Application } from "types/application";
import { connectToDatabase } from "./connect";

export async function newApplication(application: Application) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_APPLICATION_COLLECTION || !db) return

    try {
        console.log('Inserting into collection', process.env.MONGO_DB_APPLICATION_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_APPLICATION_COLLECTION)
        const res = await collection.insertOne(application)

        return res.insertedId
    } catch (e) {
        console.error(e)
    }
}
