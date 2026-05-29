import { UpdateUserDTO, UpdateUserResponse } from "@application/dtos/user/updateUserDto";
import { EmailAlreadyInUseError } from "@application/errors/user/emailAlreadyInUse";
import { RegistrationNumberAlreadyInUseError } from "@application/errors/user/registrationNumberAlreadyInUse";
import { RoleIsRequiredError } from "@application/errors/user/roleIsRequiredError";
import { UserNotFoundError } from "@application/errors/user/userNotFound";
import { Pedagogue, PedagogueVOProps } from "@domain/entities/pedagogue";
import { Professor, ProfessorVOProps } from "@domain/entities/professor";
import { RoleEnum } from "@domain/enum/role";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { UserItem } from "@domain/repositories/results/userResult";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { NameVO } from "@domain/valueObjects/shared/name";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";

export class UpdateUser {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(dto: UpdateUserDTO): Promise<Result<UpdateUserResponse>> {
    let userItem: UserItem | null = null;
    let repository: IPedagogueRepository | IProfessorRepository | null = null;

    if (dto.role === RoleEnum.PEDAGOGUE) {
      repository = this.pedagogueRepository;
      userItem = await this.pedagogueRepository.findById(dto.id);
    } else if (dto.role === RoleEnum.PROFESSOR) {
      repository = this.professorRepository;
      userItem = await this.professorRepository.findById(dto.id);
    }

    if (!userItem) {
      return Result.fail(new UserNotFoundError(dto.id));
    }
    if (!repository) {
      return Result.fail(new RoleIsRequiredError());
    }

    let userEntity: Pedagogue | Professor;
    if (userItem.role === RoleEnum.PEDAGOGUE) {
      userEntity = Pedagogue.rehydrate({
        id: userItem.id,
        name: userItem.name,
        email: userItem.email,
        phoneNumber: userItem.phoneNumber,
        registrationNumber: userItem.registrationNumber,
        userStatus: userItem.userStatus,
      });
    } else if (userItem.role === RoleEnum.PROFESSOR) {
      userEntity = Professor.rehydrate({
        id: userItem.id,
        name: userItem.name,
        email: userItem.email,
        phoneNumber: userItem.phoneNumber,
        registrationNumber: userItem.registrationNumber,
        userStatus: userItem.userStatus,
      });
    } else {
      return Result.fail(new RoleIsRequiredError());
    }

    const updateProps: Partial<PedagogueVOProps | ProfessorVOProps> = {};

    if (dto.name && dto.name !== userEntity.name.value) {
      const name = NameVO.create(dto.name);
      if (name.isFailure) return Result.fail(name.error!);
      updateProps.name = name.getValue();
    }

    if (dto.email && dto.email !== userEntity.email.value) {
      const emailOrError = EmailVO.create(dto.email);
      if (emailOrError.isFailure) return Result.fail(emailOrError.error!);
      const newEmail = emailOrError.getValue();

      // Check duplication in ALL user repositories (Pedagogue, Professor, Student)
      const [pedagogueExists, professorExists, studentExists] = await Promise.all([
        this.pedagogueRepository.existsByEmail(newEmail.value),
        this.professorRepository.existsByEmail(newEmail.value),
        this.studentRepository.existsByEmail(newEmail.value),
      ]);

      if (pedagogueExists || professorExists || studentExists) {
        return Result.fail(new EmailAlreadyInUseError(newEmail.value));
      }

      updateProps.email = newEmail;
    }

    if (dto.phoneNumber && dto.phoneNumber !== userEntity.phoneNumber.value) {
      const phoneNumber = PhoneNumberVO.create(dto.phoneNumber);
      if (phoneNumber.isFailure) return Result.fail(phoneNumber.error!);
      updateProps.phoneNumber = phoneNumber.getValue();
    }

    if (dto.registrationNumber && dto.registrationNumber !== userEntity.registrationNumber.value) {
      const registrationNumberOrError = RegistrationNumberVO.create(dto.registrationNumber);
      if (registrationNumberOrError.isFailure) return Result.fail(registrationNumberOrError.error!);
      const newRegistrationNumber = registrationNumberOrError.getValue();

      // Check duplication in ALL user repositories
      const [pedagogueExists, professorExists, studentExists] = await Promise.all([
        this.pedagogueRepository.existsByRegistrationNumber(newRegistrationNumber.value),
        this.professorRepository.existsByRegistrationNumber(newRegistrationNumber.value),
        this.studentRepository.existsByEnrollmentId(newRegistrationNumber.value),
      ]);

      if (pedagogueExists || professorExists || studentExists) {
        return Result.fail(new RegistrationNumberAlreadyInUseError(newRegistrationNumber.value));
      }

      updateProps.registrationNumber = newRegistrationNumber;
    }

    userEntity.update(updateProps);
    await repository.update(userEntity);

    return Result.ok({
      name: userEntity.name.value,
      email: userEntity.email.value,
      phoneNumber: userEntity.phoneNumber.value,
      registrationNumber: userEntity.registrationNumber.value,
    });
  }
}
