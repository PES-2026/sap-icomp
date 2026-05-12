import { AttendanceType } from "@domain/enums/attendance/attendanceTypeEnum";
import { Result } from "@domain/shared/result";
import { findValueInEnum } from "@domain/utils/enumUtils";

import { AttendanceTypeVO } from "../valueObjects/attendance/attendanceType";
import { DemandVO } from "../valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../valueObjects/attendance/generalObservations";
import { DateInput, DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

type AttendanceProps = {
  studentId: string;
  date: DateInput;
  type: string;
  demand: string;
  generalObservations?: string;
};

export class Attendance {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly studentId: ExternalIdVO,
    public date: DateVO,
    public type: AttendanceTypeVO,
    public demand: DemandVO,
    public generalObservations?: GeneralObservationsVO,
    private _removed: boolean = false,
  ) {}

  static create(props: AttendanceProps): Result<Attendance> {
    const externalId = ExternalIdVO.create();
    const studentId = ExternalIdVO.from(props.studentId);
    const date = DateVO.create(props.date);
    const type = AttendanceTypeVO.create(props.type);
    const demand = DemandVO.create(props.demand);
    const generalObservations = props.generalObservations
      ? GeneralObservationsVO.create(props.generalObservations)
      : undefined;

    const results = [externalId, studentId, date, type, demand, generalObservations];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<Attendance>(result.error!);
      }
    }

    return Result.ok<Attendance>(
      new Attendance(
        externalId.getValue(),
        studentId.getValue(),
        date.getValue(),
        type.getValue(),
        demand.getValue(),
        generalObservations?.getValue() ?? undefined,
      ),
    );
  }

  static rehydrate(id: string, props: AttendanceProps, removed: boolean = false): Attendance {
    return new Attendance(
      ExternalIdVO.fromTrusted(id),
      ExternalIdVO.fromTrusted(props.studentId),
      DateVO.fromTrusted(new Date(props.date as string | Date)),
      AttendanceTypeVO.fromTrusted(findValueInEnum(AttendanceType, props.type)),
      DemandVO.fromTrusted(props.demand),
      props.generalObservations ? GeneralObservationsVO.fromTrusted(props.generalObservations) : undefined,
      removed,
    );
  }

  update(
    type?: AttendanceTypeVO,
    date?: DateVO,
    demand?: DemandVO,
    generalObservations?: GeneralObservationsVO,
  ): void {
    if (type?.value) this.type = type;
    if (date?.value) this.date = date;
    if (demand?.value) this.demand = demand;
    if (generalObservations?.value) this.generalObservations = generalObservations;
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
