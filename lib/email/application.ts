import { Client } from 'node-mailjet';
import type { SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import type { Application } from 'types/application';

export default async function sendApplicationReceipt(application: Application) {
    const mailjet = new Client({
        apiKey: process.env.MJ_APIKEY_PUBLIC,
        apiSecret: process.env.MJ_APIKEY_PRIVATE
    });

    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: process.env.MJ_SENDER_EMAIL as string,
                    Name: process.env.MJ_SENDER_NAME as string,
                },
                To: [
                    {
                        Email: application.email,
                    },
                ],
                Subject: 'Atto application',
                HTMLPart: `<h1>Dear ${application.name}</h1>
<p>Thank you for your application to atto!<br />
Your application will be reviewed and we will shortly get in touch with you.</p>`,
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);


    return result.body.Messages[0];
}
