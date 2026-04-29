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
    public date: DateVO,
    public type: AttendanceTypeVO,
    public demand: DemandVO,
    public generalObservations?: GeneralObservationsVO,
    private _removed: boolean = false,
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
    type?: AttendanceTypeVO,
    date?: DateVO,
    demand?: DemandVO,
    generalObservations?: GeneralObservationsVO,
  ): void {
    type?.value ? (this.type = type) : undefined;
    date?.value ? (this.date = date) : undefined;
    demand?.value ? (this.demand = demand) : undefined;
    generalObservations?.value
      ? (this.generalObservations = generalObservations)
      : undefined;
  }

  remove(): void {
    if (this._removed) {
      throw new Error(`${Attendance.name}:${this.id} is already removed`);
    }
    this._removed = true;
  }

  get removed(): boolean {
    return this._removed;
  }
}
