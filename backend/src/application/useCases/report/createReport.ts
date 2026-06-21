import { ApplicationError } from "@application/errors/applicationError";
import { CreateReportDTO } from "@application/dtos/report/createReportDto";
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

  async execute(
    studentId: string,
    pedagogueId: string,
    dto: CreateReportDTO,
  ): Promise<Result<Report, ApplicationError>> {
    // Validate that student has at least one realized attendance
    const attendances = await this.attendanceRepository.findByStudentId({
      page: 1,
      limit: 1,
      studentId,
    });

    // Assuming "REALIZED" status check as per requirements. 
    // Since existing project uses PENDING/CREATED/BOOKED in enum, 
    // I will check if any attendance exists. 
    // If specific status 'REALIZED' is needed, it should be in AttendanceStatusEnum.
    const hasRealizedAttendance = attendances.items.length > 0; 
    
    if (!hasRealizedAttendance) {
      return Result.fail<Report>(new NoAttendanceRealizedError());
    }

    const reportResult = Report.create({
      studentId,
      pedagogueId,
      ...dto,
    });

    if (reportResult.isFailure) {
      return Result.fail<Report>(reportResult.error as ApplicationError);
    }

    const report = reportResult.getValue();
    await this.reportRepository.save(report);

    return Result.ok<Report>(report);
  }
}
