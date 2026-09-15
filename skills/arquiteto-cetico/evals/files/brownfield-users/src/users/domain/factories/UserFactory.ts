import { randomUUID } from "node:crypto";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { UserId } from "../value-objects/UserId";

export class UserFactory {
  static create(name: string, email: string): User {
    return new User(new UserId(randomUUID()), name, Email.create(email), new Date());
  }
}
