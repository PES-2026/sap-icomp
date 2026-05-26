import { UpdateUserDTO } from "@application/dtos/user/updateUserDto";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { RoleEnum } from "@domain/enum/role";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { Result } from "@domain/shared/result";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { NameVO } from "@domain/valueObjects/shared/name";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";

export interface UpdateUserResponse {
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
}

export class UpdateUser {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(dto: UpdateUserDTO): Promise<Result<UpdateUserResponse>> {
    let user: any;
    let repository: any;

    if (dto.role === RoleEnum.PEDAGOGUE) {
      repository = this.pedagogueRepository;
      user = await this.pedagogueRepository.findById(dto.id);
    } else if (dto.role === RoleEnum.PROFESSOR) {
      repository = this.professorRepository;
      user = await this.professorRepository.findById(dto.id);
    }

    if (!user) {
      return Result.fail(new UserNotFoundError(dto.id));
    }

    const updateProps: any = {};

    if (dto.name) {
      const name = NameVO.create(dto.name);
      if (name.isFailure) return Result.fail(name.error!);
      updateProps.name = name.getValue();
    }

    if (dto.email) {
      const email = EmailVO.create(dto.email);
      if (email.isFailure) return Result.fail(email.error!);
      updateProps.email = email.getValue();
    }

    if (dto.phoneNumber) {
      const phoneNumber = PhoneNumberVO.create(dto.phoneNumber);
      if (phoneNumber.isFailure) return Result.fail(phoneNumber.error!);
      updateProps.phoneNumber = phoneNumber.getValue();
    }

    if (dto.registrationNumber) {
      const registrationNumber = RegistrationNumberVO.create(dto.registrationNumber);
      if (registrationNumber.isFailure) return Result.fail(registrationNumber.error!);
      updateProps.registrationNumber = registrationNumber.getValue();
    }

    user.update(updateProps);
    await repository.update(user);

    return Result.ok({
      name: user.name.value,
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      registrationNumber: user.registrationNumber.value,
    });
  }
}
