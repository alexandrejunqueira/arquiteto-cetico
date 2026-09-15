import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserId } from "../../domain/value-objects/UserId";
import { UserMapper } from "../mappers/UserMapper";
import { UserDTO } from "../dtos/UserDTO";

export class GetUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(id: string): Promise<UserDTO | null> {
    const user = await this.repo.findById(new UserId(id));
    return user ? UserMapper.toDTO(user) : null;
  }
}
