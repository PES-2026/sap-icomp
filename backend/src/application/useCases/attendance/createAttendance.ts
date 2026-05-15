import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { Attendance } from "@domain/entities/attendance";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

import { CreateAttendanceDTO, CreateAttendanceResponse } from "../../dtos/attendance/createAttendanceDto";

export class CreateAttendance {
  constructor(
    private repository: IAttendanceRepository,
    private studentRepository: IStudentRepository,
  ) {}

  async execute(dto: CreateAttendanceDTO): Promise<Result<CreateAttendanceResponse, ApplicationError | DomainError>> {
    const studentExists = await this.studentRepository.existsByUUID(dto.studentId);
    if (!studentExists) {
      return Result.fail<CreateAttendanceResponse>(new StudentNotFoundError(dto.studentId));
    }

    const typeExists = await this.repository.existsTypeById(dto.typeId);
    if (!typeExists) {
      return Result.fail<CreateAttendanceResponse>(new AttendanceTypeNotFoundError(dto.typeId));
    }

    const attendanceEntity = Attendance.create({
      studentId: dto.studentId,
      date: dto.date,
      typeId: dto.typeId,
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
      typeId: attendanceEntity.getValue().typeId.value,
      demand: attendanceEntity.getValue().demand.value,
      generalObservations: attendanceEntity.getValue().generalObservations?.value ?? "",
    });
  }
}
