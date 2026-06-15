import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { Result } from "@domain/shared/result";
import { ReasonVO } from "@domain/valueObjects/schedule/reason";
import { ScheduleStatusVO } from "@domain/valueObjects/schedule/scheduleStatus";
import { TokenVO } from "@domain/valueObjects/schedule/token";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { NameVO } from "@domain/valueObjects/shared/name";

import { DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type ScheduleProps = {
  id?: string | undefined;
  pedagogueId: string;
  startDate: Date;
  endDate: Date;
  status: ScheduleStatusEnum;
  token?: string | undefined;
  studentId?: string | undefined;
  guestName?: string | undefined;
  guestEmail?: string | undefined;
  reason?: string | undefined;
  removed?: boolean;
};

export class Schedule {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly pedagogueId: ExternalIdVO,
    public startDate: DateVO,
    public endDate: DateVO,
    public token: TokenVO,
    public status: ScheduleStatusVO,
    public readonly studentId?: ExternalIdVO | undefined,
    public readonly guestName?: NameVO | undefined,
    public readonly guestEmail?: EmailVO | undefined,
    public reason?: ReasonVO | undefined,
    private _removed: boolean = false,
  ) {}

  static create(props: ScheduleProps): Result<Schedule> {
    const externalId = ExternalIdVO.create();
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const studentId = props.studentId ? ExternalIdVO.from(props.studentId) : undefined;
    const startDate = DateVO.create(props.startDate);
    const endDate = DateVO.create(props.endDate);
    const token = TokenVO.create();
    const status = ScheduleStatusVO.from(props.status);
    const reason = props.reason ? ReasonVO.create(props.reason) : undefined;
    const guestName = props.guestName ? NameVO.create(props.guestName) : undefined;
    const guestEmail = props.guestEmail ? EmailVO.create(props.guestEmail) : undefined;

    const results = [
      externalId,
      pedagogueId,
      studentId,
      startDate,
      endDate,
      token,
      status,
      reason,
      guestName,
      guestEmail,
    ];

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
        token.getValue(),
        status.getValue(),
        studentId ? studentId.getValue() : undefined,
        guestName ? guestName.getValue() : undefined,
        guestEmail ? guestEmail.getValue() : undefined,
        reason ? reason.getValue() : undefined,
        props.removed ?? false,
      ),
    );
  }

  static rehydrate(props: ScheduleProps): Schedule {
    return new Schedule(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      DateVO.fromTrusted(props.startDate),
      DateVO.fromTrusted(props.endDate),
      TokenVO.fromTrusted(props.token!),
      ScheduleStatusVO.fromTrusted(props.status),
      props.studentId ? ExternalIdVO.fromTrusted(props.studentId) : undefined,
      props.guestName ? NameVO.fromTrusted(props.guestName) : undefined,
      props.guestEmail ? EmailVO.fromTrusted(props.guestEmail) : undefined,
      props.reason ? ReasonVO.fromTrusted(props.reason) : undefined,
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
