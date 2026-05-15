import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class DiagnosisNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Diagnosis with id ${id} not found`, ErrorCategory.NOT_FOUND);
  }
}
