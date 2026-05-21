import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { Attendance } from "@domain/entities/attendance";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { DemandVO } from "@domain/valueObjects/attendance/demand";
import { GeneralObservationsVO } from "@domain/valueObjects/attendance/generalObservations";
import { DateVO } from "@domain/valueObjects/shared/date";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";

import { UpdateAttendanceDTO, UpdateAttendanceResponse } from "../../dtos/attendance/updateAttendanceDto";

export class UpdateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: UpdateAttendanceDTO): Promise<Result<UpdateAttendanceResponse, ApplicationError | DomainError>> {
    const attendance = await this.repository.findById(dto.id);

    if (!attendance) {
      return Result.fail<UpdateAttendanceResponse>(new AttendanceNotFoundError(dto.id));
    }

    if (dto.typeId) {
      const typeExists = await this.repository.existsTypeByUUID(dto.typeId);
      if (!typeExists) {
        return Result.fail<UpdateAttendanceResponse>(new AttendanceTypeNotFoundError(dto.typeId));
      }
    }

    const attendanceEntity = Attendance.rehydrate({
      id: attendance.id!,
      studentId: attendance.student.id,
      typeId: attendance.type.id,
      date: attendance.date,
      demand: attendance.demand,
      generalObservations: attendance.generalObservations,
    });

    const typeResult = dto.typeId ? ExternalIdVO.from(dto.typeId) : undefined;
    const dateResult = dto.date ? DateVO.create(dto.date) : undefined;
    const demandResult = dto.demand ? DemandVO.create(dto.demand) : undefined;
    const obsResult = dto.generalObservations ? GeneralObservationsVO.create(dto.generalObservations) : undefined;

    if (typeResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(typeResult.error!);
    if (dateResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(dateResult.error!);
    if (demandResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(demandResult.error!);
    if (obsResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(obsResult.error!);

    attendanceEntity.update(
      typeResult?.getValue() as ExternalIdVO | undefined,
      dateResult?.getValue(),
      demandResult?.getValue(),
      obsResult?.getValue(),
    );

    await this.repository.update(attendanceEntity);

    return Result.ok<UpdateAttendanceResponse>({
      id: attendanceEntity.id.value,
      studentId: attendanceEntity.studentId.value,
      typeId: attendanceEntity.typeId.value,
      date: attendanceEntity.date.value,
      demand: attendanceEntity.demand.value,
      generalObservations: attendanceEntity.generalObservations?.value ?? "",
    });
  }
}
