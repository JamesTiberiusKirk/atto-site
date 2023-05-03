import { getAllApplicationsInPast } from 'lib/db/application'
import { getAllContactRequestInPast } from 'lib/db/contactus'
import { getAllNewsSubscriptionInPast } from 'lib/db/subscriptions'
import sendEmail from 'lib/email/send';
import type { NextApiRequest, NextApiResponse } from 'next'
import ReactDOMServer from 'react-dom/server';

import type { Application } from 'types/application';
import { WorkshopOptions } from 'types/workshop';
import { env } from '~/env.mjs';
import type { ContactUs } from '~/server/api/routers/contactus';

type GelerateEmailStringProps = {
    applications?: Application[],
    contactRequests?: ContactUs[],
    newsSubscriptions?: string[],
}
function GenerateEmailString({ applications, contactRequests, newsSubscriptions }: GelerateEmailStringProps) {

    const lookupWorkshop = (name: string): string => {
        for (const w of WorkshopOptions) {
            if (w.name === name) {
                return w.display
            }
        }
        return ''
    }

    const aLen = applications?.length || 0
    const cLen = contactRequests?.length || 0
    const nLen = newsSubscriptions?.length || 0

    return ReactDOMServer.renderToString(
        <>
            <h1>Administrator&apos;s report</h1>

            <p style={{ fontSize: '15px' }}>
                In the past 24 hours we have:
            </p>
            <p style={{ fontSize: '15px' }}>
                {applications && aLen === 0 ? 'No new applications' : `Applications: ${aLen} new`}
            </p>

            <p style={{ fontSize: '15px' }}>
                {contactRequests && cLen === 0 ? 'No new contact us requests' : `Contact us requests: ${cLen} new`}
            </p>

            <p style={{ fontSize: '15px' }}>
                {newsSubscriptions && nLen === 0 ? 'No new news letter subscriptions' : `News letter subscriptions: ${nLen} new`}
            </p>

            {applications && applications?.length > 0 && (
                <div style={{
                    border: '#FF955F 2px solid',
                    padding: '5px',
                    margin: '5px',
                }}>
                    <p style={{ fontSize: '20px' }}>
                        Applications:
                    </p>

                    {applications.map((a, i) => (
                        <div
                            style={{
                                borderBottom: '#8C2F00 2px solid',
                            }}
                            key={i}>
                            <p style={{ fontSize: '15px' }}>
                                Name: {a.name}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Email: {a.email}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Pronouns: {a.pronouns}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Credits: {a.credits}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Workshops selected:
                            </p>
                            <ul>
                                {a.workshops.map(w => (
                                    <li key={w} style={{ fontSize: '15px' }}>
                                        {lookupWorkshop(w) + ' '}
                                    </li>
                                ))}
                            </ul>

                            <p style={{ fontSize: '15px' }}>
                                Email preference: {a.emailPreference ? 'opt in' : 'opt out'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {contactRequests && contactRequests?.length > 0 && (
                <div style={{
                    border: '#FF955F 2px solid',
                    padding: '5px',
                    margin: '5px',
                }}>
                    <p style={{ fontSize: '20px' }}>
                        Contact requests:
                    </p>

                    {contactRequests.map((c, i) => (
                        <div
                            style={{
                                borderBottom: '#8C2F00 2px solid',
                            }}
                            key={i}>
                            <p style={{ fontSize: '15px' }}>
                                Name: {c.name}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Email: {c.email}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Pronouns: {c.pronouns}
                            </p>

                            <p style={{ fontSize: '15px' }}>
                                Message: {c.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {newsSubscriptions && newsSubscriptions?.length > 0 && (
                <div style={{
                    border: '#FF955F 2px solid',
                    padding: '5px',
                    margin: '5px',
                }}>
                    <p style={{ fontSize: '20px' }}>
                        New news subscriptions:
                    </p>

                    {newsSubscriptions.map((ns, i) => (
                        <div
                            style={{
                                borderBottom: '#8C2F00 2px solid',
                            }}
                            key={i}>
                            <p style={{ fontSize: '15px' }}>
                                {ns}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default async function AdminReportingHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query['key'] !== 'hardcodedKey2231') return res.status(401).end()

    const hours = 24
    const [applications, contactRequests, newsSubscriptions] = await Promise.all([
        getAllApplicationsInPast(hours),
        getAllContactRequestInPast(hours),
        getAllNewsSubscriptionInPast(hours),
    ])
    if (applications?.error || contactRequests?.error || newsSubscriptions?.error) {
        console.error('Error:', applications?.error, contactRequests?.error, newsSubscriptions?.error)
        return res.status(500).end()
    }

    if (applications?.data?.length === 0 && contactRequests?.data?.length === 0 && newsSubscriptions?.data?.length === 0) {
        console.log('No updates to send to admin')
        return res.status(200).end()
    }

    const emailStringContent = GenerateEmailString({
        applications: applications?.data,
        contactRequests: contactRequests?.data,
        newsSubscriptions: newsSubscriptions?.data,
    })

    const adminEmails = env.ADMIN_EMAILS.split(',')
    console.log('admin emails: ', adminEmails)

    const anyErrors = false
    for (const email of adminEmails) {
        const emailRes = await sendEmail(email, emailStringContent)
        if (emailRes.error) {
            console.error(emailRes.error)
            continue
        }
        console.log(`Email sent to: ${email}, res: `, emailRes?.data)
    }

    if (anyErrors) return res.status(500).end()

    return res.status(200).end()
}
