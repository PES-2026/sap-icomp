import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class RemoveReportDTO {
  constructor(
    public readonly reportId: string,
    public readonly password: string,
  ) {}

  static create(reportId: any, data: any): Result<RemoveReportDTO, RequiredFieldError> {
    if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
      return Result.fail<RemoveReportDTO>(new RequiredFieldError("reportId"));
    }
    if (!data.password || typeof data.password !== "string" || data.password.trim() === "") {
      return Result.fail<RemoveReportDTO>(new RequiredFieldError("password"));
    }

    return Result.ok<RemoveReportDTO>(new RemoveReportDTO(reportId, data.password));
  }
}
