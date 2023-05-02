import { getAllApplicationsInPast } from 'lib/db/application'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function AdminReportingHandler(req: NextApiRequest, res: NextApiResponse) {
    const applications = await getAllApplicationsInPast(24)
    if (!applications) res.status(500)

    res.status(200).json(applications)
}
