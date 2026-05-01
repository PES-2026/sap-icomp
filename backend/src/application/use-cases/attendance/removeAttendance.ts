import { Attendance } from "../../../domain/entities/attendance";
import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import { RemoveAttendanceDTO } from "../../dtos/attendance/removeAttendance";

export class RemoveAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: RemoveAttendanceDTO): Promise<void> {
    const attendance: Attendance | null = await this.repository.findById(
      input.id,
    );

    if (!attendance) {
      throw new Error(`Attendance not found: '${input.id}'`);
    }

    attendance.remove();

    await this.repository.remove(input.id);
  }
}
