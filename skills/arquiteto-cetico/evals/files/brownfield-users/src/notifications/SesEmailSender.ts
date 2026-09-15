import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { IEmailSender } from "./IEmailSender";

export class SesEmailSender implements IEmailSender {
  private readonly client = new SESClient({});

  async send(to: string, subject: string, body: string): Promise<void> {
    await this.client.send(
      new SendEmailCommand({
        Source: "no-reply@example.com",
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: body } },
        },
      }),
    );
  }
}
