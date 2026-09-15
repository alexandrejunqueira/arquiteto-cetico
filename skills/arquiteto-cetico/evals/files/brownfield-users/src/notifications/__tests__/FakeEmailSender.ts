import { IEmailSender } from "../IEmailSender";

export class FakeEmailSender implements IEmailSender {
  public readonly sent: Array<{ to: string; subject: string; body: string }> = [];

  async send(to: string, subject: string, body: string): Promise<void> {
    this.sent.push({ to, subject, body });
  }
}
