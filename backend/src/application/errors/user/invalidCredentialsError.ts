import { ErrorCategory } from "@domain/errors/domainError";
import { ApplicationError } from "../applicationError";

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super("Invalid email address or password.", ErrorCategory.BUSINESS_RULE);
  }
}
