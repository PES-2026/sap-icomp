import { ActivateUserDTO } from "@application/dtos/user/activateUserDto";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { Result } from "@domain/shared/result";

export class ActivateUser {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(dto: ActivateUserDTO): Promise<Result<void>> {
    let user = await this.pedagogueRepository.findById(dto.id);
    let repository: IPedagogueRepository | IProfessorRepository = this.pedagogueRepository;

    if (!user) {
      user = await this.professorRepository.findById(dto.id);
      repository = this.professorRepository;
    }

    if (!user) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    await repository.activate(dto.id);

    return Result.ok();
  }
}
