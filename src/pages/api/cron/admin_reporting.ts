import { getAllApplicationsInPast } from 'lib/db/application'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function AdminReportingHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query['key'] !== 'hardcodedKey2231') return res.status(404).end()

    const applications = await getAllApplicationsInPast(24)
    if (!applications) return res.status(500).end()

    res.status(200).json(applications)
}
