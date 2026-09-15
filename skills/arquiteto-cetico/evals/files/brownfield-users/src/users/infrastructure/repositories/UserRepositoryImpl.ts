import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { UserId } from "../../domain/value-objects/UserId";

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id.value,
        name: user.name,
        email: user.email.value,
        createdAt: user.createdAt,
      },
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id: id.value } });
    if (!row) return null;
    return new User(new UserId(row.id), row.name, Email.create(row.email), row.createdAt);
  }
}
