import { ApplicationError } from "@application/errors/applicationError";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";
import { GetReportInitialDataResponseDTO } from "@application/dtos/report/getReportInitialDataDto";

export class GetReportInitialData {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(studentId: any): Promise<Result<GetReportInitialDataResponseDTO, ApplicationError>> {
    if (!studentId || typeof studentId !== "string" || studentId.trim() === "") {
      return Result.fail<GetReportInitialDataResponseDTO>(new RequiredFieldError("studentId"));
    }
    const student = await this.studentRepository.findByUUID(studentId);

    if (!student) {
      return Result.fail<GetReportInitialDataResponseDTO>(new StudentNotFoundError(studentId));
    }

    return Result.ok<GetReportInitialDataResponseDTO>({
      potential: student.potential ?? "",
      difficulties: student.difficulties ?? "",
    });
  }
}
