import { UpdateUserPasswordDTO } from "@application/dtos/user/updateUserPasswordDto";
import { InvalidPasswordError } from "@application/errors/user/invalidPassword";
import { NewPasswordEqualToOldError } from "@application/errors/user/newPasswordEqualToOldError";
import { OldPasswordNotDefinedError } from "@application/errors/user/oldPasswordNotDefinedError";
import { RoleIsRequiredError } from "@application/errors/user/roleIsRequiredError";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { Pedagogue } from "@domain/entities/pedagogue";
import { Professor } from "@domain/entities/professor";
import { RoleEnum } from "@domain/enum/role";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { IHashService } from "@domain/services/hashService";
import { Result } from "@domain/shared/result";
import { PasswordVO } from "@domain/valueObjects/shared/password";

export class UpdateUserPassword {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: UpdateUserPasswordDTO): Promise<Result<void>> {
    if (dto.oldPassword === dto.newPassword) {
      return Result.fail(new NewPasswordEqualToOldError());
    }

    const repository = this.getRepositoryByRole(dto.role);
    if (!repository) {
      return Result.fail(new RoleIsRequiredError());
    }

    const userItem = await repository.findByIdWithPassword(dto.id);
    if (!userItem) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    const currentHashedPassword = userItem.password;
    if (!currentHashedPassword) {
      return Result.fail(new OldPasswordNotDefinedError());
    }

    const isOldPasswordCorrect = await this.hashService.compare(dto.oldPassword, currentHashedPassword);
    if (!isOldPasswordCorrect) {
      return Result.fail(new InvalidPasswordError());
    }

    const hashedNewPassword = await this.hashService.hash(dto.newPassword);
    const newPasswordVO = PasswordVO.create(dto.newPassword, hashedNewPassword);
    if (newPasswordVO.isFailure) {
      return Result.fail(newPasswordVO.error!);
    }

    const commonProps = {
      id: userItem.id,
      name: userItem.name,
      email: userItem.email,
      phoneNumber: userItem.phoneNumber ?? "",
      registrationNumber: userItem.registrationNumber,
      userStatus: userItem.userStatus,
    };

    if (userItem.role === RoleEnum.PEDAGOGUE) {
      const pedagogue = Pedagogue.rehydrate(commonProps);
      pedagogue.changePassword(newPasswordVO.getValue());
      await (repository as IPedagogueRepository).update(pedagogue);
    } else {
      const professor = Professor.rehydrate(commonProps);
      professor.changePassword(newPasswordVO.getValue());
      await (repository as IProfessorRepository).update(professor);
    }

    return Result.ok();
  }

  private getRepositoryByRole(role: string): IPedagogueRepository | IProfessorRepository | null {
    if (role === RoleEnum.PEDAGOGUE) return this.pedagogueRepository;
    if (role === RoleEnum.PROFESSOR) return this.professorRepository;
    return null;
  }
}
