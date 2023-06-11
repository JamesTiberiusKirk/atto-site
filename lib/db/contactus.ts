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

export async function getAllContactRequestInPast(h?: number) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const collection = db.collection(env.MONGO_DB_CONTACTS_COLLECTION);

    let filter = {};
    if (h) {
      filter = {
        _id: {
          $gt: ObjectId.createFromTime(Date.now() / 1000 - h * 60 * 60),
        },
      };
      console.log(
        `Quering collection ${env.MONGO_DB_APPLICATION_COLLECTION} for any new records in the past ${h}`
      );
    } else {
      console.log(
        `Quering collection ${env.MONGO_DB_APPLICATION_COLLECTION} for all records`
      );
    }
    const res = await collection.find<ContactUs>(filter).toArray();

    const contactUsRequests: ContactUs[] = res.map((c) => {
      return {
        name: c.name,
        email: c.email,
        pronouns: c.pronouns,
        message: c.message,
      };
    });

    return { data: contactUsRequests };
  } catch (e) {
    return { error: e };
  }
}
