import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class PedagogueNotFoundError extends ApplicationError {
  constructor() {
    super("No pedagogue was found in the database. An attendance must be linked to a pedagogue.", ErrorCategory.BUSINESS_RULE);
  }
}
