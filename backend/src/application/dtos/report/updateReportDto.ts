import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class UpdateReportDTO {
  constructor(
    public readonly reportId: string,
    public readonly studentId: string,
    public readonly pedagogueId: string,
    public readonly condition: string,
    public readonly potential: string,
    public readonly difficulties: string,
    public readonly recommendation: string,
    public readonly conclusion: string,
  ) {}

  static create(reportId: any, data: any): Result<UpdateReportDTO, RequiredFieldError> {
    const { studentId, pedagogueId, condition, potential, difficulties, recommendation, conclusion } = data;

    if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("reportId"));
    }
    if (!studentId || typeof studentId !== "string" || studentId.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("studentId"));
    }
    if (!pedagogueId || typeof pedagogueId !== "string" || pedagogueId.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("pedagogueId"));
    }
    if (!condition || typeof condition !== "string" || condition.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("condition"));
    }
    if (!potential || typeof potential !== "string" || potential.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("potential"));
    }
    if (!difficulties || typeof difficulties !== "string" || difficulties.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("difficulties"));
    }
    if (!recommendation || typeof recommendation !== "string" || recommendation.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("recommendation"));
    }
    if (!conclusion || typeof conclusion !== "string" || conclusion.trim() === "") {
      return Result.fail<UpdateReportDTO>(new RequiredFieldError("conclusion"));
    }

    return Result.ok<UpdateReportDTO>(
      new UpdateReportDTO(
        reportId,
        studentId,
        pedagogueId,
        condition,
        potential,
        difficulties,
        recommendation,
        conclusion,
      ),
    );
  }
}
