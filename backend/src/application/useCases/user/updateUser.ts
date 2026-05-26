import { UpdateUserDTO } from "@application/dtos/user/updateUserDto";
import { EmailAlreadyInUseError } from "@application/errors/user/emailAlreadyInUse";
import { RegistrationNumberAlreadyInUseError } from "@application/errors/user/registrationNumberAlreadyInUse";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { RoleEnum } from "@domain/enum/role";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
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
    private readonly studentRepository: IStudentRepository,
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
      const emailOrError = EmailVO.create(dto.email);
      if (emailOrError.isFailure) return Result.fail(emailOrError.error!);
      const newEmail = emailOrError.getValue();

      // Check if email changed
      if (newEmail.value !== user.email.value) {
        // Check duplication in ALL user repositories (Pedagogue, Professor, Student)
        const [pedagogueExists, professorExists, studentExists] = await Promise.all([
          this.pedagogueRepository.existsByEmail(newEmail.value),
          this.professorRepository.existsByEmail(newEmail.value),
          this.studentRepository.existsByEmail(newEmail.value),
        ]);

        if (pedagogueExists || professorExists || studentExists) {
          return Result.fail(new EmailAlreadyInUseError(newEmail.value));
        }
      }

      updateProps.email = newEmail;
    }

    if (dto.phoneNumber) {
      const phoneNumber = PhoneNumberVO.create(dto.phoneNumber);
      if (phoneNumber.isFailure) return Result.fail(phoneNumber.error!);
      updateProps.phoneNumber = phoneNumber.getValue();
    }

    if (dto.registrationNumber) {
      const registrationNumberOrError = RegistrationNumberVO.create(dto.registrationNumber);
      if (registrationNumberOrError.isFailure) return Result.fail(registrationNumberOrError.error!);
      const newRegistrationNumber = registrationNumberOrError.getValue();

      // Check if registration number changed
      if (newRegistrationNumber.value !== user.registrationNumber.value) {
        // Check duplication in ALL user repositories
        const [pedagogueExists, professorExists, studentExists] = await Promise.all([
          this.pedagogueRepository.existsByRegistrationNumber(newRegistrationNumber.value),
          this.professorRepository.existsByRegistrationNumber(newRegistrationNumber.value),
          this.studentRepository.existsByEnrollmentId(newRegistrationNumber.value),
        ]);

        if (pedagogueExists || professorExists || studentExists) {
          return Result.fail(new RegistrationNumberAlreadyInUseError(newRegistrationNumber.value));
        }
      }

      updateProps.registrationNumber = newRegistrationNumber;
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
