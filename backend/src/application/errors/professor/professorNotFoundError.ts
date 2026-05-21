import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ProfessorNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Professor with id '${id}' not found.`, ErrorCategory.NOT_FOUND);
  }
}
