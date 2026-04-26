import { Attendance } from "../../../domain/entities/attendance";
import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import { AttendanceTypeVO } from "../../../domain/valueObjects/attendance/attendanceType";
import { DemandVO } from "../../../domain/valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../../../domain/valueObjects/attendance/generalObservations";
import { DateVO } from "../../../domain/valueObjects/shared/date";
import { ExternalIdVO } from "../../../domain/valueObjects/shared/externalId";
import { StudentId } from "../../../domain/valueObjects/student/studentId";
import { CreateAttendanceDTO } from "../../dtos/attendance/createAttendance.dto";

export class CreateAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: CreateAttendanceDTO): Promise<Attendance> {
    const attendance = new Attendance(
      ExternalIdVO.create(),
      StudentId.reutilise(input.studentId),
      DateVO.create(input.date),
      AttendanceTypeVO.create(input.type),
      DemandVO.create(input.demand),
      GeneralObservationsVO.create(input.generalObservations),
    );

    await this.repository.save(attendance);
    return attendance;
  }
}
