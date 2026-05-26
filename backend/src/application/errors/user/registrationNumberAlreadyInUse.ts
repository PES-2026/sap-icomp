import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class RegistrationNumberAlreadyInUseError extends ApplicationError {
  constructor(registrationNumber: string) {
    super(`A matrícula ${registrationNumber} já está em uso por outra conta.`, ErrorCategory.CONFLICT);
  }
}
