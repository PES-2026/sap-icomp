export enum ErrorCategory {
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  BUSINESS_RULE = "BUSINESS_RULE",
  SYSTEM_ERROR = "SYSTEM_ERROR",
}
export abstract class DomainError {
  constructor(
    public readonly message: string,
    public readonly category: ErrorCategory,
  ) {}
}
