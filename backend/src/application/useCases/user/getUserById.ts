import { UserByIdDTO } from "@application/dtos/user/userByIdDto";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { RoleEnum } from "@domain/enum/role";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { UserItem } from "@domain/repositories/results/userResult";
import { Result } from "@domain/shared/result";

export class GetUserById {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(dto: UserByIdDTO): Promise<Result<UserItem>> {
    let user: UserItem | null = await this.pedagogueRepository.findById(dto.id);
    let roleName = RoleEnum.PEDAGOGUE;

    if (!user) {
      user = await this.professorRepository.findById(dto.id);
      roleName = RoleEnum.PROFESSOR;
    }

    if (!user) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    // Map entity to the response format
    const response: UserItem = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      registrationNumber: user.registrationNumber,
      role: roleName,
      userStatus: user.userStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return Result.ok(response);
  }
}
