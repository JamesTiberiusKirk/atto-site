import { Workshop } from "types/workshop";
import clientPromise from "./connect";
import { env } from "~/env.mjs";
import { ObjectId } from "mongodb";


const colName = env.MONGO_DB_WORKSHOPS_COLLECTION

export async function updateWorkshops(update: Workshop[]) {
  const client = await clientPromise;
  const db = client.db();

  try {
    console.log("Inserting into collection", colName);

    const collection = db.collection(colName);

    await collection.deleteMany()

    const bulkOps = update.map(w => {
      return {
        updateOne: {
          filter: { _id: new ObjectId(w.key) },
          update: {
            $set: { ...w, _id: new ObjectId(w.key) },
          },
          upsert: true,
        },
      }
    });

    const res = await collection.bulkWrite(bulkOps);

    return { data: res };
  } catch (e) {
    console.error('Error during bulkWrite:', e);
    return { error: e };
  }
}



export async function getAllWorkshops(display?: boolean) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const collection = db.collection(colName);
    let filter = {};

    if (display !== undefined){
      filter = {
        display: display,
      }
    }

    console.log(
      `Quering collection ${colName} for all records`
    );
    const res = await collection.find<Workshop>(filter).toArray();

    const workshops: Workshop[] = res.map(w=>{
      return {
        instructorName: w.instructorName,
        key: w.key,
        imgPath: w.imgPath,
        desc: w.desc,
        type: w.type,
        date: w.date,
        time: w.time,
        price: w.price,
        link: w.link,
        display: w.display,
      } as Workshop
    })

    return { data: workshops, error: undefined };
  } catch (e) {
    console.error(e);
    return { data: undefined, error: e };
  }
}

