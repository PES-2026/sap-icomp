import { AttendanceTypeVO } from "../valueObjects/attendance/attendanceType";
import { DemandVO } from "../valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../valueObjects/attendance/generalObservations";
import { DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";
import { StudentId } from "../valueObjects/student/studentId";

export class Attendance {
  constructor(
    public readonly id: ExternalIdVO,
    public studentId: StudentId,
    public date: DateVO,
    public type: AttendanceTypeVO,
    public demand: DemandVO,
    public generalObservations: GeneralObservationsVO,
    private _removed: boolean = false,
  ) {}

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
