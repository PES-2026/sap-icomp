import { UpdateUserPasswordDTO } from "@application/dtos/user/updateUserPasswordDto";
import { InvalidPasswordError } from "@application/errors/user/invalidPassword";
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
    let user: any;
    let repository: any;

    if (dto.role === RoleEnum.PEDAGOGUE) {
      user = await this.pedagogueRepository.findById(dto.id);
      repository = this.pedagogueRepository;
    } else if (dto.role === RoleEnum.PROFESSOR) {
      user = await this.professorRepository.findById(dto.id);
      repository = this.professorRepository;
    }

    if (!user) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    const isOldPasswordCorrect = await this.hashService.compare(dto.oldPassword, user.password.value);

    if (!isOldPasswordCorrect) {
      return Result.fail(new InvalidPasswordError());
    }

    const hashedPassword = await this.hashService.hash(dto.newPassword);
    const newPasswordVO = PasswordVO.create(dto.newPassword, hashedPassword);

    if (newPasswordVO.isFailure) {
      return Result.fail(newPasswordVO.error!);
    }

    // Recreate user with the new password
    const userProps = {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      registrationNumber: user.registrationNumber.value,
      userStatus: user.userStatus.value,
      password: hashedPassword,
    };

    const updatedUser =
      dto.role === RoleEnum.PEDAGOGUE ? Pedagogue.rehydrate(userProps) : Professor.rehydrate(userProps);

    updatedUser.changePassword(newPasswordVO.getValue());

    await repository.update(updatedUser);

    return Result.ok();
  }
}
