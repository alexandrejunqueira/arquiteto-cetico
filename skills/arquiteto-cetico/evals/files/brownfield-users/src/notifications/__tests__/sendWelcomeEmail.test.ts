import { describe, it, expect } from "vitest";
import { FakeEmailSender } from "./FakeEmailSender";
import { sendWelcomeEmail } from "../sendWelcomeEmail";

describe("sendWelcomeEmail", () => {
  it("uses only the first name in subject and body", async () => {
    const fake = new FakeEmailSender();
    await sendWelcomeEmail(fake, "ana@example.com", "Ana Paula Souza");

    expect(fake.sent).toHaveLength(1);
    expect(fake.sent[0].subject).toBe("Bem-vindo, Ana!");
    expect(fake.sent[0].body).toContain("Olá Ana,");
  });
});
