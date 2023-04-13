import { Client } from 'node-mailjet';
import type { SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import { ContactUs } from '~/server/api/routers/contactus';

export default async function sendContactusReceipt(contactme: ContactUs) {
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
                        Email: contactme.email,
                    },
                ],
                Subject: 'Atto contact request',
                HTMLPart: `<h1>Dear ${contactme.name}</h1>
<h3>Thank you for your contact request to atto!</h3><br />
We will get back to you as soon as possible.`,
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    return result.body.Messages[0];
}