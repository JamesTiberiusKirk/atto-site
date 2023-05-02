import { getAllApplicationsInPast } from 'lib/db/application'
import { getAllContactRequestInPast } from 'lib/db/contactus'
import { getAllNewsSubscriptionInPast } from 'lib/db/subscriptions'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function AdminReportingHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query['key'] !== 'hardcodedKey2231') return res.status(404).end()

    const hours = 24
    const [applications, contactRequests, newsSubscriptions] = await Promise.all([
        getAllApplicationsInPast(hours),
        getAllContactRequestInPast(hours),
        getAllNewsSubscriptionInPast(hours),
    ])
    if (!applications || !contactRequests || !newsSubscriptions) return res.status(500).end()

    return res.status(200).json({ applications, contactRequests, newsSubscriptions })
}
