import { ObjectId } from "mongodb";
import type { ContactUs } from "~/server/api/routers/contactus";
import clientPromise from "./connect";
import { env } from "~/env.mjs";

export async function newContactus(contactus: ContactUs) {
  const client = await clientPromise;
  const db = client.db();

  try {
    console.log("Inserting into collection", env.MONGO_DB_CONTACTS_COLLECTION);
    const collection = db.collection(env.MONGO_DB_CONTACTS_COLLECTION);
    const res = await collection.insertOne(contactus);

    return { data: res.insertedId };
  } catch (e) {
    return { error: e };
  }
}

export async function getAllContactRequestInPast(h: number) {
  const client = await clientPromise;
  const db = client.db();

  try {
    console.log(
      `Quering collection ${env.MONGO_DB_CONTACTS_COLLECTION} for any new records in the past ${h} hours`
    );
    const collection = db.collection(env.MONGO_DB_CONTACTS_COLLECTION);
    const res = await collection
      .find<ContactUs>({
        _id: {
          $gt: ObjectId.createFromTime(Date.now() / 1000 - h * 60 * 60),
        },
      })
      .toArray();

    return { data: res };
  } catch (e) {
    return { error: e };
  }
}
