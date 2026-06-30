import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class GetInitialDataDTO {
  constructor(public readonly studentId: string) {}

  static create(studentId: any): Result<GetInitialDataDTO, RequiredFieldError> {
    if (!studentId || typeof studentId !== "string" || studentId.trim() === "") {
      return Result.fail<GetInitialDataDTO>(new RequiredFieldError("studentId"));
    }

    return Result.ok<GetInitialDataDTO>(new GetInitialDataDTO(studentId));
  }
}
