import { Attendance } from "../../../domain/entities/attendance";
import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import {
  AttendanceByIdDTO,
  AttendanceByIdResponse,
} from "../../dtos/attendance/attendanceById.dto";

export class AttendanceById {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: AttendanceByIdDTO): Promise<AttendanceByIdResponse> {
    const attendance: Attendance | null = await this.repository.findById(
      input.id,
    );

    if (!attendance) {
      throw new Error(`Attendance not found: '${input.id}'`);
    }

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
