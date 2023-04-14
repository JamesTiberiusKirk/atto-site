import { connectToDatabase } from "./connect";

export async function newNewsSubscription(email: string) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION || !db) return

    try {
        console.log('inserting into collection', process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.updateOne({ email }, { $set: { email } }, { upsert: true })

        return res
    } catch (e) {
        console.error(e)
    }
}

export async function removeNewsSubscription(email: string) {
    const db = await connectToDatabase()

    if (!process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION || !db) return

    try {
        console.log('removing from collection', process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const collection = db.collection(process.env.MONGO_DB_NEWS_LETTER_SUBSCRIPTONS_COLLECTION)
        const res = await collection.findOneAndDelete({ email })

        return res
    } catch (e) {
        console.error(e)
    }
}
