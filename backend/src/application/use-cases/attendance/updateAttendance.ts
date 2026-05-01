import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import { AttendanceTypeVO } from "../../../domain/valueObjects/attendance/attendanceType";
import { DemandVO } from "../../../domain/valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../../../domain/valueObjects/attendance/generalObservations";
import { DateVO } from "../../../domain/valueObjects/shared/date";
import {
  UpdateAttendanceDTO,
  UpdateAttendanceResponse,
} from "../../dtos/attendance/updateAttedance.dto";

export class UpdateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: UpdateAttendanceDTO): Promise<UpdateAttendanceResponse> {
    const attendance = await this.repository.findById(dto.id);

    if (!attendance) {
      throw new Error(`Attendance not found for the id: '${dto.id}'`);
    }

    attendance.update(
      dto.type ? AttendanceTypeVO.create(dto.type) : undefined,
      dto.date ? DateVO.create(dto.date) : undefined,
      dto.demand ? DemandVO.create(dto.demand) : undefined,
      dto.generalObservations
        ? GeneralObservationsVO.create(dto.generalObservations)
        : undefined,
    );

    await this.repository.update(attendance);

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
