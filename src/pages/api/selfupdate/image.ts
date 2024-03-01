import { put } from '@vercel/blob';
import { withSessionRoute } from 'lib/auth/withSession';
import type { PageConfig } from 'next';
import { env } from '~/env.mjs';

export default withSessionRoute(async function handler(req,res) {
    const type: string = req.query.type as string
    if (type != "headshot" && type != "ts_headshot"){
        console.log("invalid type")
        return res.status(400).json({error: "invalid type"})
    } 

    const filename = req.query.filename
    if (filename === "") {
        console.log("invalid name")
        return res.status(400).json({error: "invalid name"})
    }
    
    const environment = env.NODE_ENV

    const filePath =`${environment}/${type}/${req.query.filename as string}`

    const blob = await put(filePath, req, {
        access: 'public',
    });

    return res.status(200).json(blob);
})

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
}
