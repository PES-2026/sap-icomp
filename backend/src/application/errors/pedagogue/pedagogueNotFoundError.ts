import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class PedagogueNotFoundError extends ApplicationError {
  constructor(id?: string) {
    super(
      id ? `Pedagogue with ID ${id} was not found.` : "No pedagogue was found in the database.",
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
