import { ApplicationError } from "@application/errors/applicationError";
import { DomainError, ErrorCategory } from "@domain/errors/domainError";

type MappableError = DomainError | ApplicationError;

const categoryToStatus: Record<ErrorCategory, number> = {
  [ErrorCategory.VALIDATION]: 400,
  [ErrorCategory.UNAUTHORIZED]: 401,
  [ErrorCategory.FORBIDDEN]: 403,
  [ErrorCategory.NOT_FOUND]: 404,
  [ErrorCategory.BUSINESS_RULE]: 422,
};

export class HttpErrorMapper {
  static toResponse(error: MappableError) {
    return {
      statusCode: categoryToStatus[error.category] ?? 500,
      body: {
        error: error.constructor.name,
        message: error.message,
      },
    };
  }
}
