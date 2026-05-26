import { RemoveUserDTO } from "@application/dtos/user/removeUserDto";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { Result } from "@domain/shared/result";

export class RemoveUser {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(dto: RemoveUserDTO): Promise<Result<void>> {
    let user = await this.pedagogueRepository.findById(dto.id);
    let repository: any = this.pedagogueRepository;

    if (!user) {
      user = await this.professorRepository.findById(dto.id);
      repository = this.professorRepository;
    }

    if (!user) {
      return Result.fail(new UserNotFoundError());
    }

    await repository.remove(dto.id);

    return Result.ok();
  }
}
