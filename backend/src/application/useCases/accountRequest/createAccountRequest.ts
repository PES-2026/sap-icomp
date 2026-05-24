import {
  CreateEducatorDTO,
  CreateEducatorResponse,
} from "@application/dtos/educator/createEducator";
import { ApplicationError } from "@application/errors/applicationError";
import { DomainError, ErrorCategory } from "@domain/errors/domainError";
import { Result } from "@domain/shared/result";
import { IAccountRequestRepository } from "@domain/repositories/AccountRequestRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { AccountRequest } from "@domain/entities/accountRequest";
import { UserTypeEnum } from "@domain/enum/userType";
import { PedagogueEmailAlreadyExistsError } from "@application/errors/pedagogue/pedagogueEmailAlreadyExistsError";
import { ProfessorEmailAlreadyExistsError } from "@application/errors/professor/professorEmailAlreadyExist";
import { PedagogueRegistrationNumberAlreadyExistsError } from "@application/errors/pedagogue/pedagogueRegistrationNumberAlreadyExists";
import { ProfessorRegistrationNumberAlreadyExistsError } from "@application/errors/professor/professorRegistrationNumberAlreadyExists";
import { EmailConfirmationMismatchError } from "@application/errors/accountRequest/emailConfirmationMismatch";
import { PasswordConfirmationMismatchError } from "@application/errors/accountRequest/passwordConfirmationMismatch";
export class CreateAccountRequest {
  constructor(
    private readonly repository: IAccountRequestRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(props: CreateEducatorDTO): Promise<Result<CreateEducatorResponse>> {
    // Business rules and validations
    //email
    if (props.email !== props.emailConfirmation) {
      return Result.fail(new EmailConfirmationMismatchError(props.email, props.emailConfirmation));
    }
    const emailValidation = await this.validateEmail(props.email, props.userType);

    if (emailValidation.isFailure) {
      return Result.fail<CreateEducatorResponse>(emailValidation.error!);
    }
    //registration number
    const registrationNumberValidation = await this.validateRegistrationNumber(
      props.registrationNumber,
      props.userType,
    );

    if (registrationNumberValidation.isFailure) {
      return Result.fail<CreateEducatorResponse>(registrationNumberValidation.error!);
    }
    //Password confirmation
    if (props.password !== props.passwordConfirmation) {
      return Result.fail(new PasswordConfirmationMismatchError());
    }
    const accountRequestOrError = AccountRequest.create({
      name: props.name,
      email: props.email,
      registrationNumber: props.registrationNumber,
      phoneNumber: props.phoneNumber,
      userType: props.userType,
      password: props.password,
      userStatus: "PENDING",
    });

    if (accountRequestOrError.isFailure) {
      return Result.fail<CreateEducatorResponse>(accountRequestOrError.error!);
    }

    await this.repository.save(accountRequestOrError.getValue());

    return Result.ok<CreateEducatorResponse>({
      id: accountRequestOrError.getValue().id.value,
      name: accountRequestOrError.getValue().name.value,
      email: accountRequestOrError.getValue().email.value,
      phoneNumber: accountRequestOrError.getValue().phoneNumber.value,
      registrationNumber: accountRequestOrError.getValue().registrationNumber.value,
      userType: accountRequestOrError.getValue().userType.value,
      userStatus: accountRequestOrError.getValue().userStatus.value,
    });
  }

  private async validateEmail(email: string, userType: string): Promise<Result<void, DomainError>> {
    switch (userType) {
      case UserTypeEnum.PEDAGOGUE: {
        const exists = await this.pedagogueRepository.existsByEmail(email);

        if (exists) {
          return Result.fail(new PedagogueEmailAlreadyExistsError(email));
        } else {
          return Result.ok();
        }
      }

      case UserTypeEnum.PROFESSOR: {
        const exists = await this.professorRepository.existsByEmail(email);

        if (exists) {
          return Result.fail(new ProfessorEmailAlreadyExistsError(email));
        } else {
          return Result.ok();
        }
      }
    }

    return Result.ok();
  }

  private async validateRegistrationNumber(
    registrationNumber: string,
    userType: string,
  ): Promise<Result<void, DomainError>> {
    switch (userType) {
      case UserTypeEnum.PEDAGOGUE: {
        const exists = await this.pedagogueRepository.existsByRegistrationNumber(registrationNumber);
        if (exists) {
          return Result.fail(new PedagogueRegistrationNumberAlreadyExistsError(registrationNumber));
        } else {
          return Result.ok();
        }
      }
      case UserTypeEnum.PROFESSOR: {
        const exists = await this.professorRepository.existsByRegistrationNumber(registrationNumber);
        if (exists) {
          return Result.fail(new ProfessorRegistrationNumberAlreadyExistsError(registrationNumber));
        } else {
          return Result.ok();
        }
      }
    }
    return Result.ok();
  }
}
