import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class EmailAlreadyExistsError extends ApplicationError {
  constructor(email: string) {
    super(`The email '${email}' already exists to an another student`, ErrorCategory.BUSINESS_RULE);
  }
}
