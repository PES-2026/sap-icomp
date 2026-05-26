import { UserByIdDTO } from "@application/dtos/user/userByIdDto";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { UserListItem } from "@domain/repositories/results/userResult";
import { Result } from "@domain/shared/result";

export class GetUserById {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(dto: UserByIdDTO): Promise<Result<UserListItem>> {
    let user: any = await this.pedagogueRepository.findById(dto.id);
    let roleName = "PEDAGOGUE";

    if (!user) {
      user = await this.professorRepository.findById(dto.id);
      roleName = "PROFESSOR";
    }

    if (!user) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    // Map entity to the response format
    const response: UserListItem = {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      registrationNumber: user.registrationNumber.value,
      role: roleName,
      userStatus: user.userStatus.value,
      createdAt: (user as any).createdAt || new Date(),
      updatedAt: (user as any).updatedAt || new Date(),
    };

    return Result.ok(response);
  }
}
