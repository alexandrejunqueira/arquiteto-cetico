import { User } from "../../domain/entities/User";
import { UserDTO } from "../dtos/UserDTO";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
