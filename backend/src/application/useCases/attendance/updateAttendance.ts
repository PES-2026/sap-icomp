import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";
import { Attendance } from "@domain/entities/attendance";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { AttendanceTypeVO } from "@domain/valueObjects/attendance/attendanceType";
import { DemandVO } from "@domain/valueObjects/attendance/demand";
import { GeneralObservationsVO } from "@domain/valueObjects/attendance/generalObservations";
import { DateVO } from "@domain/valueObjects/shared/date";

import { UpdateAttendanceDTO, UpdateAttendanceResponse } from "../../dtos/attendance/updateAttendanceDto";

export class UpdateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: UpdateAttendanceDTO): Promise<Result<UpdateAttendanceResponse, ApplicationError | DomainError>> {
    const attendance = await this.repository.findById(dto.id);

    if (!attendance) {
      return Result.fail<UpdateAttendanceResponse>(new AttendanceNotFoundError(dto.id));
    }

    const attendanceEntity = Attendance.rehydrate({
      id: attendance.id!,
      studentId: attendance.studentId,
      type: attendance.type,
      date: attendance.date,
      demand: attendance.demand,
      generalObservations: attendance.generalObservations,
    });

    const typeResult = dto.type ? AttendanceTypeVO.create(dto.type) : undefined;
    const dateResult = dto.date ? DateVO.create(dto.date) : undefined;
    const demandResult = dto.demand ? DemandVO.create(dto.demand) : undefined;
    const obsResult = dto.generalObservations ? GeneralObservationsVO.create(dto.generalObservations) : undefined;

    if (typeResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(typeResult.error!);
    if (dateResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(dateResult.error!);
    if (demandResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(demandResult.error!);
    if (obsResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(obsResult.error!);

    attendanceEntity.update(
      typeResult?.getValue(),
      dateResult?.getValue(),
      demandResult?.getValue(),
      obsResult?.getValue(),
    );

    await this.repository.update(attendanceEntity);

    return Result.ok<UpdateAttendanceResponse>({
      id: attendanceEntity.id.value,
      studentId: attendanceEntity.studentId.value,
      type: attendanceEntity.type.value,
      date: attendanceEntity.date.value,
      demand: attendanceEntity.demand.value,
      generalObservations: attendanceEntity.generalObservations?.value ?? "",
    });
  }
}
