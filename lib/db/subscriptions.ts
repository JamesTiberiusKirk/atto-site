import { ObjectId } from "mongodb";
import clientPromise from "./connect";
import { env } from "~/env.mjs";

export async function newNewsSubscription(email: string) {
    const client = await clientPromise
    const db = client.db()

    try {
        console.log('Upserting into collection', env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const collection = db.collection(env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.updateOne({ email }, { $set: { email } }, { upsert: true })

        return { data: res }
    } catch (e) {
        return { error: e }
    }
}

export async function removeNewsSubscription(email: string) {
    const client = await clientPromise
    const db = client.db()

    try {
        console.log('Removing from collection', env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const collection = db.collection(env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.findOneAndDelete({ email })

        return res
    } catch (e) {
        console.error(e)
    }
}

export async function getAllNewsSubscriptionInPast(h: number) {
    const client = await clientPromise
    const db = client.db()

    try {
        console.log(`Quering collection ${env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION} for new records in the past ${h} hours`)
        const collection = db.collection(env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.find({
            _id: {
                $gt: ObjectId.createFromTime(Date.now() / 1000 - h * 60 * 60)
            }
        }).toArray()

        const result: string[] = []

        for (const email of res) {
            result.push(email['email'] as string)
        }

        return { data: result, error: undefined }
    } catch (e) {
        return { data: undefined, error: e }
    }
}
