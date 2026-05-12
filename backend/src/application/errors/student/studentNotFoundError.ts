import { ErrorCategory } from "@domain/errors/domainError";
import { ApplicationError } from "../applicationError";

export class StudentNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`The student with the ID: '${id}' not found in the database`, ErrorCategory.BUSSINESS_RULE);
  }
}
