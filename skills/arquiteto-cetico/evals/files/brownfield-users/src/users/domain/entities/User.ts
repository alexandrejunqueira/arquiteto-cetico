import { Email } from "../value-objects/Email";
import { UserId } from "../value-objects/UserId";

export class User {
  constructor(
    public readonly id: UserId,
    public readonly name: string,
    public readonly email: Email,
    public readonly createdAt: Date,
  ) {}
}
