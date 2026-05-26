import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class UserNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`User with ID ${id} was not found.`, ErrorCategory.NOT_FOUND);
  }
}
