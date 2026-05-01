import { Attendance } from "../../../domain/entities/attendance";
import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import {
  CreateAttendanceDTO,
  CreateAttendanceResponse,
} from "../../dtos/attendance/createAttendance.dto";

export class CreateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: CreateAttendanceDTO): Promise<CreateAttendanceResponse> {
    const attendance = Attendance.create(
      dto.studentId,
      dto.date,
      dto.type,
      dto.demand,
      dto.generalObservations ? dto.generalObservations : undefined,
    );

    await this.repository.save(attendance);

    return {
      id: attendance.id.value,
      studentId: attendance.studentId.value,
      type: attendance.type.value,
      date: attendance.date.value,
      demand: attendance.demand.value,
      generalObservations: attendance.generalObservations?.value ?? "",
    };
  }
}
