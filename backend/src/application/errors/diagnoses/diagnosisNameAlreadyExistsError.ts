import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class DiagnosisNameAlreadyExistsError extends ApplicationError {
  constructor(name: string) {
    super(`The diagnosis name '${name}' already exists`, ErrorCategory.BUSINESS_RULE);
  }
}
