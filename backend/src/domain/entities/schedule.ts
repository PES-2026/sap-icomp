import { Result } from "@domain/shared/result";

import { DateInput, DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type ScheduleProps = {
  id?: string;
  pedagogueId: string;
  startDate: DateInput;
  endDate: DateInput;
  removed?: boolean;
};

export class Schedule {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly pedagogueId: ExternalIdVO,
    public startDate: DateVO,
    public endDate: DateVO,
    private _removed: boolean = false,
  ) {}

  static create(props: ScheduleProps): Result<Schedule> {
    const externalId = ExternalIdVO.create();
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const startDate = DateVO.create(props.startDate);
    const endDate = DateVO.create(props.endDate);

    const results = [externalId, pedagogueId, startDate, endDate];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<Schedule>(result.error!);
      }
    }

    return Result.ok<Schedule>(
      new Schedule(
        externalId.getValue(),
        pedagogueId.getValue(),
        startDate.getValue(),
        endDate.getValue(),
        props.removed ?? false,
      ),
    );
  }

  static rehydrate(props: ScheduleProps): Schedule {
    return new Schedule(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      DateVO.fromTrusted(new Date(props.startDate as string | Date)),
      DateVO.fromTrusted(new Date(props.endDate as string | Date)),
      props.removed ?? false,
    );
  }

  remove(): void {
    if (this._removed) {
      throw new Error(`${Schedule.name}:${this.id} is already removed`);
    }
    this._removed = true;
  }

  get removed(): boolean {
    return this._removed;
  }
}
