import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class RegistrationNumberAlreadyInUseError extends ApplicationError {
  constructor(registrationNumber: string) {
    super(`The registration "${registrationNumber}" is already in use by another account`, ErrorCategory.VALIDATION);
  }
}
