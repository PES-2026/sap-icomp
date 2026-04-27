import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import { AttendanceTypeVO } from "../../../domain/valueObjects/attendance/attendanceType";
import { DemandVO } from "../../../domain/valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../../../domain/valueObjects/attendance/generalObservations";
import { DateVO } from "../../../domain/valueObjects/shared/date";
import { UpdateAttendanceDTO } from "../../dtos/attendance/updateAttedance.dto";

export class UpdateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: UpdateAttendanceDTO): Promise<void> {
    const attendance = await this.repository.findById(dto.id);

    if (!attendance) {
      throw new Error(`Attendance not found for the id: '${dto.id}'`);
    }

    attendance.update(
      AttendanceTypeVO.create(dto.type),
      DateVO.create(dto.date),
      DemandVO.create(dto.demand),
      GeneralObservationsVO.create(dto.generalObservations),
    );

    await this.repository.update(attendance);
  }
}
