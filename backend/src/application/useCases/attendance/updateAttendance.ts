import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";
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

    const typeResult = dto.type ? AttendanceTypeVO.create(dto.type) : undefined;
    const dateResult = dto.date ? DateVO.create(dto.date) : undefined;
    const demandResult = dto.demand ? DemandVO.create(dto.demand) : undefined;
    const obsResult = dto.generalObservations ? GeneralObservationsVO.create(dto.generalObservations) : undefined;

    if (typeResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(typeResult.error!);
    if (dateResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(dateResult.error!);
    if (demandResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(demandResult.error!);
    if (obsResult?.isFailure) return Result.fail<UpdateAttendanceResponse>(obsResult.error!);

    attendance.update(typeResult?.getValue(), dateResult?.getValue(), demandResult?.getValue(), obsResult?.getValue());

    await this.repository.update(attendance);

    return Result.ok<UpdateAttendanceResponse>({
      id: attendance.id.value,
      studentId: attendance.studentId.value,
      type: attendance.type.value,
      date: attendance.date.value,
      demand: attendance.demand.value,
      generalObservations: attendance.generalObservations?.value ?? "",
    });
  }
}
