import { Client } from 'node-mailjet';
import type { SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import type { ContactUs } from '~/server/api/routers/contactus';

export default async function sendContactusReceipt(contactus: ContactUs) {
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
                        Email: contactus.email,
                    },
                ],
                Subject: 'Atto contact request',
                HTMLPart: `<h1>Dear ${contactus.name}</h1>
<p>
Thank you for your contact request to atto!<br />
We will get back to you as soon as possible.
</p>`,
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    return result.body.Messages[0];
}
