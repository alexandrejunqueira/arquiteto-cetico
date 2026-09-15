import { IEmailSender } from "./IEmailSender";

export async function sendWelcomeEmail(sender: IEmailSender, to: string, name: string): Promise<void> {
  const firstName = name.trim().split(/\s+/)[0] ?? name;
  await sender.send(to, `Bem-vindo, ${firstName}!`, `Olá ${firstName}, sua conta foi criada.`);
}
