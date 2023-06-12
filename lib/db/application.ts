import { ObjectId } from "mongodb";
import type { Application } from "types/application";
import clientPromise from "./connect";
import { env } from "~/env.mjs";

export async function newApplication(application: Application) {
  const client = await clientPromise;
  const db = client.db();

  try {
    console.log(
      "Inserting into collection",
      env.MONGO_DB_APPLICATION_COLLECTION
    );
    const collection = db.collection(env.MONGO_DB_APPLICATION_COLLECTION);
    const res = await collection.insertOne(application);

    return { data: res.insertedId };
  } catch (e) {
    return { error: e };
  }
}

export async function getAllApplicationsInPast(h?: number) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const collection = db.collection(env.MONGO_DB_APPLICATION_COLLECTION);
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
    const res = await collection.find<Application>(filter).toArray();

    const applications: Application[] = res.map((a) => {
      return {
        name: a.name,
        email: a.email,
        pronouns: a.pronouns,
        workshops: a.workshops,
        credits: a.credits,
        emailPreference: a.emailPreference,
      };
    });

    return { data: applications, error: undefined };
  } catch (e) {
    console.error(e);
    return { data: undefined, error: e };
  }
}
