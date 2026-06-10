import { CreateProfessorDTO, CreateProfessorResponse } from "@application/dtos/professor/createProfessor";
import { EmailConfirmationMismatchError } from "@application/errors/accountRequest/emailConfirmationMismatch";
import { PasswordConfirmationMismatchError } from "@application/errors/accountRequest/passwordConfirmationMismatch";
import { PedagogueEmailAlreadyExistsError } from "@application/errors/pedagogue/pedagogueEmailAlreadyExistsError";
import { PedagogueRegistrationNumberAlreadyExistsError } from "@application/errors/pedagogue/pedagogueRegistrationNumberAlreadyExists";
import { ProfessorEmailAlreadyExistsError } from "@application/errors/professor/professorEmailAlreadyExist";
import { ProfessorRegistrationNumberAlreadyExistsError } from "@application/errors/professor/professorRegistrationNumberAlreadyExists";
import { AccountRequest } from "@domain/entities/accountRequest";
import { DomainError } from "@domain/errors/domainError";
import { IAccountRequestRepository } from "@domain/repositories/accountRequestRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { IHashService } from "@domain/services/hashService";
import { Result } from "@domain/shared/result";
export class CreateAccountRequest {
  constructor(
    private readonly repository: IAccountRequestRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(props: CreateProfessorDTO): Promise<Result<CreateProfessorResponse>> {
    // Business rules and validations
    //email
    if (props.email !== props.emailConfirmation) {
      return Result.fail(new EmailConfirmationMismatchError(props.email, props.emailConfirmation));
    }
    const emailValidation = await this.validateEmail(props.email);

    if (emailValidation.isFailure) {
      return Result.fail<CreateProfessorResponse>(emailValidation.error!);
    }
    //registration number
    const registrationNumberValidation = await this.validateRegistrationNumber(props.registrationNumber);

    if (registrationNumberValidation.isFailure) {
      return Result.fail<CreateProfessorResponse>(registrationNumberValidation.error!);
    }
    //Password confirmation
    if (props.password !== props.passwordConfirmation) {
      return Result.fail(new PasswordConfirmationMismatchError());
    }

    const hashedPassword = await this.hashService.hash(props.password);

    const accountRequestOrError = AccountRequest.create({
      name: props.name,
      email: props.email,
      registrationNumber: props.registrationNumber,
      phoneNumber: props.phoneNumber,
      plainPassword: props.password,
      hashedPassword: hashedPassword,
      userStatus: "PENDING",
      role: props.role,
    });

    if (accountRequestOrError.isFailure) {
      return Result.fail<CreateProfessorResponse>(accountRequestOrError.error!);
    }

    await this.repository.save(accountRequestOrError.getValue());

    const accountRequest = accountRequestOrError.getValue();

    return Result.ok<CreateProfessorResponse>({
      id: accountRequest.id.value,
      name: accountRequest.name.value,
      email: accountRequest.email.value,
      phoneNumber: accountRequest.phoneNumber.value,
      registrationNumber: accountRequest.registrationNumber.value,
      role: accountRequest.role?.value,
      userStatus: accountRequest.userStatus.value,
    });
  }

  private async validateEmail(email: string): Promise<Result<void, DomainError>> {
    const existsPedagogue = await this.pedagogueRepository.existsByEmail(email);
    if (existsPedagogue) {
      return Result.fail(new PedagogueEmailAlreadyExistsError(email));
    }

    const existsProfessor = await this.professorRepository.existsByEmail(email);
    if (existsProfessor) {
      return Result.fail(new ProfessorEmailAlreadyExistsError(email));
    }

    return Result.ok();
  }

  private async validateRegistrationNumber(registrationNumber: string): Promise<Result<void, DomainError>> {
    const existsPedagogue = await this.pedagogueRepository.existsByRegistrationNumber(registrationNumber);
    if (existsPedagogue) {
      return Result.fail(new PedagogueRegistrationNumberAlreadyExistsError(registrationNumber));
    }

    const existsProfessor = await this.professorRepository.existsByRegistrationNumber(registrationNumber);
    if (existsProfessor) {
      return Result.fail(new ProfessorRegistrationNumberAlreadyExistsError(registrationNumber));
    }

    return Result.ok();
  }
}
