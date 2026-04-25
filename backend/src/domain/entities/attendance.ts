import { AttendanceTypeVO } from "../valueObjects/attendance/attendanceType";
import { DemandVO } from "../valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../valueObjects/attendance/generalObservations";
import { DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";
import { StudentId } from "../valueObjects/student/studentId";

export class Attendance {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly studentId: StudentId,
    public readonly date: DateVO,
    public readonly type: AttendanceTypeVO,
    public readonly demand: DemandVO,
    public readonly generalObservations: GeneralObservationsVO,
  ) {}
}
