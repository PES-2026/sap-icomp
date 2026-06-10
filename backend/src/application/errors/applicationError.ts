import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export abstract class ApplicationError extends DomainError {
  constructor(
    public readonly message: string,
    public readonly category: ErrorCategory,
  ) {
    super(message, category);
  }
}
