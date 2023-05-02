import { ObjectId } from "mongodb";
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

export async function getAllApplicationsInPast(h: number): Promise<Application[] | undefined> {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_APPLICATION_COLLECTION || !db) return

    try {
        console.log(`Quering collection ${process.env.MONGO_DB_APPLICATION_COLLECTION} for any new records in the past ${h}`)
        const collection = db.collection(process.env.MONGO_DB_APPLICATION_COLLECTION)
        const res = await collection.find<Application>({
            _id: {
                $gt: ObjectId.createFromTime(Date.now() / 1000 - h * 60 * 60)
            }
        }).toArray()


        return res
    } catch (e) {
        console.error(e)
    }

}
