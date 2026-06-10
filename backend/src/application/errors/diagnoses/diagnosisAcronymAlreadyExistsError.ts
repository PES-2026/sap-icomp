import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class DiagnosisAcronymAlreadyExistsError extends ApplicationError {
  constructor(acronym: string) {
    super(`The diagnosis acronym '${acronym}' already exists`, ErrorCategory.BUSINESS_RULE);
  }
}
