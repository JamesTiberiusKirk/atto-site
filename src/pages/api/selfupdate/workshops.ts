import { withSessionRoute } from 'lib/auth/withSession';
import { updateWorkshops } from 'lib/db/workshop';
import { ObjectId } from 'mongodb';
import { Workshop } from 'types/workshop';

export default withSessionRoute(async function handler(req,res) {
    let update = JSON.parse(req.body).workshops as Workshop[]

    if (typeof update !== "object" || update.length === 0) return res.status(400).json({error: "invalid data"})

    update = update.map(u=>{
        if (u.key.search("EMPTY")!==-1) {
            return{...u, key:(new ObjectId()).toString() }
        }
        return {...u}
    })

    const dbRes = await updateWorkshops(update)
    if (dbRes.error){
        console.log("error updating db", dbRes)
        return res.status(500).json({error: "error updating db"})
    }

    return res.status(200).json(dbRes.data);
})
