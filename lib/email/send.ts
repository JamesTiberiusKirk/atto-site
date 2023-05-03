import { Client, SendEmailV3_1, LibraryResponse } from "node-mailjet";

export default async function sendEmail(recepient: string, htmlContent: string) {
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
                        Email: recepient,
                    },
                ],
                Subject: 'Atto application',
                HTMLPart: htmlContent,
            },
        ],
    };

    try {
        const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
            .post('send', { version: 'v3.1' })
            .request(data);

        return { data: result.body.Messages[0] }
    } catch (e) {
        return { error: e }
    }


}
