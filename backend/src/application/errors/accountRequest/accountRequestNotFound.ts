import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class AccountRequestNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Account request with id ${id} not found`, ErrorCategory.NOT_FOUND);
  }
}
