import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserFactory } from "../../domain/factories/UserFactory";
import { UserMapper } from "../mappers/UserMapper";
import { UserDTO } from "../dtos/UserDTO";

export class CreateUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(name: string, email: string): Promise<UserDTO> {
    const user = UserFactory.create(name, email);
    await this.repo.save(user);
    return UserMapper.toDTO(user);
  }
}
