import { AttendanceTypeVO } from "../valueObjects/attendance/attendanceType";
import { DemandVO } from "../valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../valueObjects/attendance/generalObservations";
import { DateInput, DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";
import { StudentId } from "../valueObjects/student/studentId";

export class Attendance {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly studentId: StudentId,
    public readonly date: DateVO,
    public readonly type: AttendanceTypeVO,
    public readonly demand: DemandVO,
    public readonly generalObservations?: GeneralObservationsVO,
  ) {}

  static create(
    studentId: string,
    date: DateInput,
    type: string,
    demand: string,
    generalObservations?: string,
  ): Attendance {
    return new Attendance(
      ExternalIdVO.create(),
      StudentId.reutilise(studentId),
      DateVO.create(date),
      AttendanceTypeVO.create(type),
      DemandVO.create(demand),
      generalObservations
        ? GeneralObservationsVO.create(generalObservations)
        : undefined,
    );
  }

  update(
    type: AttendanceTypeVO,
    date: DateVO,
    demand: DemandVO,
    generalObservations: GeneralObservationsVO,
  ): void {
    this.type = type;
    this.date = date;
    this.demand = demand;
    this.generalObservations = generalObservations;
  }
}
