export enum ErrorCategory {
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SERVER_ERROR = "SERVER_ERROR",
  BUSSINESS_RULE = "BUSSINESS_RULE",
}
export abstract class DomainError {
  constructor(
    public readonly message: string,
    public readonly category: ErrorCategory,
  ) {}
}
