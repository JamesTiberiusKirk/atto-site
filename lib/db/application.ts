import { Application } from "types/application";
import { connectToDatabase } from "./connect";

export async function newApplication(application: Application) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB || !db) return

    try {
        console.log('inserting into collection', process.env.MONGO_DB)
        const collection = db.collection(process.env.MONGO_DB)
        const res = await collection.insertOne(application)

        return res.insertedId
    } catch (e) {
        console.error(e)
    }
}
