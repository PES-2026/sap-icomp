import { ErrorCategory } from "@domain/errors/domainError";

export abstract class ApplicationError {
  constructor(
    public readonly message: string,
    public readonly category: ErrorCategory,
  ) {}
}
