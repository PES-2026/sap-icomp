import { ApplicationError } from "@application/errors/applicationError";
import { UserNotFoundError } from "@application/errors/user/userNotFoundError";
import { RoleEnum } from "@domain/enum/role";
import { DomainError } from "@domain/errors/domainError";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { UserResolverResult } from "@domain/repositories/results/userResolverResult";
import { Result } from "@domain/shared/result";

export class UserResolver {
  constructor(
    private professorRepository: IProfessorRepository,
    private pedagogueRepository: IPedagogueRepository,
  ) {}

  async execute(email: string): Promise<Result<UserResolverResult, ApplicationError | DomainError>> {
    const professor = await this.professorRepository.findByEmail(email);
    if (professor) {
      return Result.ok<UserResolverResult>({ userData: professor, role: RoleEnum.PROFESSOR });
    }

    const pedagogue = await this.pedagogueRepository.findByEmail(email);
    if (pedagogue) {
      return Result.ok<UserResolverResult>({ userData: pedagogue, role: RoleEnum.PEDAGOGUE });
    }

    return Result.fail<UserResolverResult>(new UserNotFoundError());
  }
}
