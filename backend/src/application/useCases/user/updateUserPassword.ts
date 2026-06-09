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
import { UserResult } from "@domain/repositories/results/userResult";
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
    let userItem: UserResult | null = null;
    let repository: IPedagogueRepository | IProfessorRepository | null = null;

    if (dto.role === RoleEnum.PEDAGOGUE) {
      userItem = await this.pedagogueRepository.findById(dto.id);
      repository = this.pedagogueRepository;
    } else if (dto.role === RoleEnum.PROFESSOR) {
      userItem = await this.professorRepository.findById(dto.id);
      repository = this.professorRepository;
    }

    if (repository === null) {
      return Result.fail(new RoleIsRequiredError());
    }

    if (!userItem) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    let userEntity: Pedagogue | Professor;
    if (userItem.role === RoleEnum.PEDAGOGUE) {
      userEntity = Pedagogue.rehydrate({
        id: userItem.id,
        name: userItem.name,
        email: userItem.email,
        phoneNumber: userItem.phoneNumber ?? "",
        registrationNumber: userItem.registrationNumber,
        userStatus: userItem.userStatus,
      });
    } else if (userItem.role === RoleEnum.PROFESSOR) {
      userEntity = Professor.rehydrate({
        id: userItem.id,
        name: userItem.name,
        email: userItem.email,
        phoneNumber: userItem.phoneNumber ?? "",
        registrationNumber: userItem.registrationNumber,
        userStatus: userItem.userStatus,
      });
    } else {
      return Result.fail(new RoleIsRequiredError());
    }

    const userPassword = userEntity.password?.value;

    if (!userPassword) {
      return Result.fail(new OldPasswordNotDefinedError());
    }

    const isOldPasswordCorrect = await this.hashService.compare(dto.oldPassword, userPassword);

    if (!isOldPasswordCorrect) {
      return Result.fail(new InvalidPasswordError());
    }

    if (dto.oldPassword !== dto.newPassword) {
      const hashedPassword = await this.hashService.hash(dto.newPassword);
      const newPasswordVO = PasswordVO.create(dto.newPassword, hashedPassword);
      if (newPasswordVO.isFailure) {
        return Result.fail(newPasswordVO.error!);
      }

      userEntity.changePassword(newPasswordVO.getValue());

      if (userEntity instanceof Pedagogue) {
        await (repository as IPedagogueRepository).update(userEntity);
      } else {
        await (repository as IProfessorRepository).update(userEntity as Professor);
      }

      return Result.ok();
    } else {
      return Result.fail(new NewPasswordEqualToOldError());
    }
  }
}
