import { DomainError } from "./domainError";

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`The email '${email}' is already registered.`);
  }
}

export class InvalidStudentDataError extends DomainError {
  constructor(reason: string) {
    super(`Invalid student data provided. Reason: ${reason}`);
  }
}
