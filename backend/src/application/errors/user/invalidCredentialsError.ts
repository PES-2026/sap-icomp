import { ErrorCategory } from "@domain/errors/domainError";
import { ApplicationError } from "../applicationError";

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super("Email ou senha inválidos.", ErrorCategory.BUSINESS_RULE);
  }
}
