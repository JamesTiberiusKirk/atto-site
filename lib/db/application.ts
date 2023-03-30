import { connectToDatabase } from "./connect";

export async function newApplication(application: Application) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB || !db) return

    const collection = db.collection(process.env.MONGO_DB)

    const res = await collection.insertOne(application)

    return res.insertedId
}
