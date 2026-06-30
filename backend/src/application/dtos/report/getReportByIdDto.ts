import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class GetReportByIdDTO {
  constructor(public readonly reportId: string) {}

  static create(reportId: any): Result<GetReportByIdDTO, RequiredFieldError> {
    if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
      return Result.fail<GetReportByIdDTO>(new RequiredFieldError("reportId"));
    }

    return Result.ok<GetReportByIdDTO>(new GetReportByIdDTO(reportId));
  }
}
