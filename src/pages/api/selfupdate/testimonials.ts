import { withSessionRoute } from 'lib/auth/withSession';
import { updateTestimonials } from 'lib/db/testimonials';
import type { CarouselData, Testimonial } from 'types/testimonial';

export default withSessionRoute(async function handler(req,res) {
    const update = (JSON.parse(req.body as string) as { testimonials:Testimonial[], carouselData: CarouselData })

    if (typeof update !== "object") return res.status(400).json({error: "invalid data"})

    const dbRes = await updateTestimonials(update.testimonials, update.carouselData)
    if (dbRes.error){
        console.log("error updating db", dbRes)
        return res.status(500).json({error: "error updating db"})
    }

    return res.status(200).json(dbRes.data);
})
