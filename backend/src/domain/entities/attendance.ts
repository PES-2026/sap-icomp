import { Result } from "@domain/shared/result";

import { DemandVO } from "../valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../valueObjects/attendance/generalObservations";
import { DateInput, DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

type AttendanceProps = {
  id?: string;
  studentId: string;
  date: DateInput;
  typeId: string;
  demand: string;
  generalObservations?: string;
  removed?: boolean;
};

export class Attendance {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly studentId: ExternalIdVO,
    public date: DateVO,
    public typeId: ExternalIdVO,
    public demand: DemandVO,
    public generalObservations?: GeneralObservationsVO,
    private _removed: boolean = false,
  ) {}

  static create(props: AttendanceProps): Result<Attendance> {
    const externalId = ExternalIdVO.create();
    const studentId = ExternalIdVO.from(props.studentId);
    const date = DateVO.create(props.date);
    const typeId = ExternalIdVO.from(props.typeId);
    const demand = DemandVO.create(props.demand);
    const generalObservations = props.generalObservations
      ? GeneralObservationsVO.create(props.generalObservations)
      : undefined;

    const results = [externalId, studentId, date, typeId, demand, generalObservations];

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
        typeId.getValue() as ExternalIdVO,
        demand.getValue(),
        generalObservations?.getValue() ?? undefined,
      ),
    );
  }

  static rehydrate(props: AttendanceProps): Attendance {
    return new Attendance(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.studentId),
      DateVO.fromTrusted(new Date(props.date as string | Date)),
      ExternalIdVO.fromTrusted(props.typeId),
      DemandVO.fromTrusted(props.demand),
      props.generalObservations ? GeneralObservationsVO.fromTrusted(props.generalObservations) : undefined,
      props.removed ?? false,
    );
  }

  update(type?: ExternalIdVO, date?: DateVO, demand?: DemandVO, generalObservations?: GeneralObservationsVO): void {
    if (type?.value) this.typeId = type;
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
