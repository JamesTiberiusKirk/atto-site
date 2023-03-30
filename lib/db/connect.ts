import * as mongoDB from "mongodb";

export async function connectToDatabase() {
    if (!process.env.MONGO_URL) return

    try {
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGO_URL);

        await client.connect();

        const db: mongoDB.Db = client.db(process.env.MONGO_NAME);

        return db
    } catch (e) {
        console.log(e)
    }
}
