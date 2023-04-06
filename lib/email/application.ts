import { SendEmailV3_1, LibraryResponse, Client } from 'node-mailjet';
import { Application } from 'types/application';

export default async function sendApplicationReceipt(application: Application) {
    const mailjet = new Client({
        apiKey: process.env.MJ_APIKEY_PUBLIC,
        apiSecret: process.env.MJ_APIKEY_PRIVATE
    });

    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: 'mail@dumitruvulpe.com',
                    Name: 'atto',
                },
                To: [
                    {
                        Email: application.email,
                    },
                ],
                Subject: 'Atto application',
                HTMLPart: `<h1>Dear ${application.name}</h1>
<h3>Thank you for your application to atto!</h3><br />
Your application will be reviewed and we will shortly get in touch with you.`,
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    return result
}
