import clientPromise from "./connect";
import { env } from "~/env.mjs";
import type { CarouselData, Testimonial } from "types/testimonial";

const colName = env.MONGO_DB_GENERAL_COLLECTION

type DbSchema = {
  type: string
  testimonials: Testimonial[]
  carouselData: CarouselData
}

export async function updateTestimonials(update: Testimonial[], carouselData: CarouselData) {
  const client = await clientPromise;
  const db = client.db();

  try {
    console.log("updating in collection", colName);

    const u: DbSchema = {
      type: "testimonials",
      testimonials: update,
      carouselData: carouselData,
    }

    const collection = db.collection(colName);
    const res = await collection.updateOne({type:'testimonials'}, {$set:u}, {upsert:true})

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
    const filter = { type: "testimonials"};

    console.log(
      `Quering collection ${colName} for all records`
    );

    const res = await collection.findOne<DbSchema>(filter);

    console.log(res)

    const t: Testimonial[] = res?.testimonials.map(t=>{
      if((display !== undefined) && !t.display) return

      return {
        quote: t.quote,
        from: t.from,
        display: t.display,
        headshot: t.headshot ?? null,
      } as Testimonial
    }) as Testimonial[]

    let cQuotes = res?.carouselData.quotes.map(q=>{
      return {
        quote: q.quote,
        display: q.display,
      }
    }) as {quote:string, display:boolean}[]

    let cPics = res?.carouselData.pictures.map(p=>{
      return {
        link: p.link,
        display: p.display,
      }
    }) as {link:string, display:boolean}[]

    if(display){
      cPics = cPics.filter(c=>c.display)
      cQuotes = cQuotes.filter(c=>c.display)
    }

    const c: CarouselData = {
      quotes: cQuotes ? cQuotes : [],
      pictures: cPics ? cPics : [],
    }

    return {
      data: {
        testimonials: t,
        carouselData: c,
      }, error: undefined,
    };
  } catch (e) {

    console.error(e);
    return { data: undefined, error: e };
  }
}

