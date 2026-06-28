import { ApplicationError } from "@application/errors/applicationError";
import { CreateReportDTO, CreateReportResponseDTO } from "@application/dtos/report/createReportDto";
import { Report } from "@domain/entities/report";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { NoAttendanceRealizedError } from "@domain/errors/attendance/noAttendanceRealizedError";

export class CreateReport {
  constructor(
    private readonly reportRepository: IReportRepository,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(dto: CreateReportDTO): Promise<Result<CreateReportResponseDTO, ApplicationError>> {
    const attendances = await this.attendanceRepository.findByStudentId({
      page: 1,
      limit: 1,
      studentId: dto.studentId,
    });

    const hasRealizedAttendance = attendances.items.length > 0;

    if (!hasRealizedAttendance) {
      return Result.fail<CreateReportResponseDTO>(new NoAttendanceRealizedError());
    }

    const reportResult = Report.create({
      ...dto,
    });

    if (reportResult.isFailure) {
      return Result.fail<CreateReportResponseDTO>(reportResult.error as ApplicationError);
    }

    const report = reportResult.getValue();
    await this.reportRepository.save(report);

    return Result.ok<CreateReportResponseDTO>({
      id: report.id.value,
      studentId: report.studentId.value,
      pedagogueId: report.pedagogueId.value,
      condition: report.condition.value,
      potential: report.potential.value,
      difficulties: report.difficulties.value,
      recommendation: report.recommendation.value,
      conclusion: report.conclusion.value,
    });
  }
}
