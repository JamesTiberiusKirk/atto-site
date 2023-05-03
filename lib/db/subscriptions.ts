import { ObjectId } from "mongodb";
import { connectToDatabase } from "./connect";

export async function newNewsSubscription(email: string) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION || !db) return

    try {
        console.log('Upserting into collection', process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.updateOne({ email }, { $set: { email } }, { upsert: true })

        return { data: res }
    } catch (e) {
        return { error: e }
    }
}

export async function removeNewsSubscription(email: string) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION || !db) return

    try {
        console.log('Removing from collection', process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.findOneAndDelete({ email })

        return res
    } catch (e) {
        console.error(e)
    }
}

export async function getAllNewsSubscriptionInPast(h: number): Promise<any[] | undefined> {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION || !db) return

    try {
        console.log(`Quering collection ${process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION} for new records in the past ${h} hours`)
        const collection = db.collection(process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.find({
            _id: {
                $gt: ObjectId.createFromTime(Date.now() / 1000 - h * 60 * 60)
            }
        }).toArray()

        return res
    } catch (e) {
        console.error(e)
    }
}
