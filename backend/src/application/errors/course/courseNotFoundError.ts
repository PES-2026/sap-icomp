import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class CourseNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Course with id '${id}' not found.`, ErrorCategory.NOT_FOUND);
  }
}
