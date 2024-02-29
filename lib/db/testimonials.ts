import clientPromise from "./connect";
import { env } from "~/env.mjs";
import { ObjectId } from "mongodb";
import type { CarouselData, Testimonial } from "types/testimonial";

const colName = env.MONGO_DB_GENERAL_COLLECTION

type DbSchema = {
  testimonials: Testimonial[]
  carouselData: CarouselData
}

export async function updateTestimonials(update: Testimonial[], carouselData: CarouselData) {
  const client = await clientPromise;
  const db = client.db();

  try {
    console.log("Inserting into collection", colName);

    const u: DbSchema = {
      testimonials: update,
      carouselData: carouselData,
    }

    const collection = db.collection(colName);
    const res = await collection.updateOne({_id: new ObjectId("testimonials")}, u)

    return { data: res };
  } catch (e) {
    console.error('Error during update:', e);
    return { error: e };
  }
}

export async function getAllTestimonials(display?: boolean) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const collection = db.collection(colName);
    let filter: any = { _id: new ObjectId("testimonials")};

    if (display !== undefined){
      filter = {
        ...filter,
        display: display,
      }
    }

    console.log(
      `Quering collection ${colName} for all records`
    );

    const res = await collection.findOne<DbSchema>(filter);
    return { data: {
      testimonials: res?.testimonials,
      carouselData: res?.carouselData,
    }, error: undefined };
  } catch (e) {

    console.error(e);
    return { data: undefined, error: e };
  }
}

