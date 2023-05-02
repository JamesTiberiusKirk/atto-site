import { Client } from 'node-mailjet';
import type { SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import ReactDOMServer from 'react-dom/server';
import type { ContactUs } from '~/server/api/routers/contactus';


function EmailHTML(contactus: ContactUs) {
    return ReactDOMServer.renderToString(
        <>
            <h1>Dear {contactus.name}</h1>
            <p
                style={{
                    fontSize: '20px',
                }}>
                Thank you for your contact request to atto!<br />
                We will get back to you as soon as possible.
            </p>
            <br />
            <br />
            <br />
            <img src='https://attoworkshops.com/logo_with_name.png'
                style={{
                    width: '200px',
                    left: '0',
                }}
            />
        </>
    )
}

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
                HTMLPart: EmailHTML(contactus),
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    return result.body.Messages[0];
}
