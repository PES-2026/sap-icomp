import { Attendance } from "@domain/entities/attendance";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";

import { CreateAttendanceDTO, CreateAttendanceResponse } from "../../dtos/attendance/createAttendanceDto";
import { ApplicationError } from "@application/errors/applicationError";
import { DomainError } from "@domain/errors/domainError";

export class CreateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: CreateAttendanceDTO): Promise<Result<CreateAttendanceResponse, ApplicationError | DomainError>> {
    const attendanceEntity = Attendance.create({
      studentId: dto.studentId,
      date: dto.date,
      type: dto.type,
      demand: dto.demand,
      generalObservations: dto.generalObservations ?? "",
    });

    if (attendanceEntity.isFailure) {
      return Result.fail<CreateAttendanceResponse>(attendanceEntity.error!);
    }

    await this.repository.save(attendanceEntity.getValue());

    return Result.ok<CreateAttendanceResponse>({
      id: attendanceEntity.getValue().id.value,
      studentId: attendanceEntity.getValue().studentId.value,
      date: attendanceEntity.getValue().date.value,
      type: attendanceEntity.getValue().type.value,
      demand: attendanceEntity.getValue().demand.value,
      generalObservations: attendanceEntity.getValue().generalObservations?.value ?? "",
    });
  }
}
