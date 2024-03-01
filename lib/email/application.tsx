import { Client } from "node-mailjet";
import type { SendEmailV3_1, LibraryResponse } from "node-mailjet";
import type { Application } from "types/application";
import ReactDOMServer from "react-dom/server";

function EmailHTML(application: Application) {
  return ReactDOMServer.renderToString(
    <>
      <h1>Dear {application.name}</h1>
      <p
        style={{
          fontSize: "20px",
        }}
      >
        Thank you for your application to atto workshops, we will be in-touch
        shortly. Please check your junk email just incase.
      </p>
      <p> Many thanks, atto</p>
      <br />
      <br />
      <br />
      { /* eslint-disable @next/next/no-img-element */ }
      <img
        src="https://attoworkshops.com/logo_with_name.png"
        alt="atto logo with name"
        style={{
          width: "200px",
          left: "0",
        }}
      />
    </>
  );
}

export default async function sendApplicationReceipt(application: Application) {
  const mailjet = new Client({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
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
        Subject: "Atto application",
        TextPart: `Thank you for your application to atto workshops, we will be in-touch shortly. Please check your junk email just incase.
Many thanks, atto`,
        HTMLPart: EmailHTML(application),
      },
    ],
  };

  try {
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post("send", { version: "v3.1" })
      .request(data);

    return { data: result.body.Messages[0] };
  } catch (e) {
    return { error: e };
  }
}
