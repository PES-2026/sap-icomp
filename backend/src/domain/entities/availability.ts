import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { Result } from "@domain/shared/result";
import { AvailabilityStatusVO } from "@domain/valueObjects/availability/availabilityStatus";
import { DayOfWeekVO } from "@domain/valueObjects/availability/dayOfWeek";
import { DurationVO } from "@domain/valueObjects/availability/duration";

import { AvailabilityStatusEnum } from "../enum/availabilityStatus";
import { DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type AvailabilityProps = {
  id?: string | undefined;
  startDateTime: Date;
  endDateTime: Date;
  status: AvailabilityStatusEnum;
  attendanceTime: number;
  dayOfWeek: DaysOfWeekEnum;
  pedagogueId: string;
  appointmentId?: string | undefined;
};

export class Availability {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly pedagogueId: ExternalIdVO,
    public startDateTime: DateVO,
    public endDateTime: DateVO,
    public attendanceTime: DurationVO,
    public status: AvailabilityStatusVO,
    public dayOfWeek: DayOfWeekVO,
  ) {}

  static create(props: AvailabilityProps): Result<Availability> {
    const externalId = ExternalIdVO.create();
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const startDateTime = DateVO.create(props.startDateTime);
    const endDateTime = DateVO.create(props.endDateTime);
    const attendanceTime = DurationVO.create(props.attendanceTime);
    const status = AvailabilityStatusVO.from(props.status);
    const dayOfWeek = DayOfWeekVO.from(props.dayOfWeek);

    const results = [externalId, pedagogueId, startDateTime, endDateTime, attendanceTime, dayOfWeek];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<Availability>(result.error!);
      }
    }

    return Result.ok<Availability>(
      new Availability(
        externalId.getValue(),
        pedagogueId.getValue(),
        startDateTime.getValue(),
        endDateTime.getValue(),
        attendanceTime.getValue(),
        status.getValue(),
        dayOfWeek.getValue(),
      ),
    );
  }

  static rehydrate(props: AvailabilityProps): Availability {
    return new Availability(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      DateVO.fromTrusted(props.startDateTime),
      DateVO.fromTrusted(props.endDateTime),
      DurationVO.fromTrusted(props.attendanceTime),
      AvailabilityStatusVO.fromTrusted(props.status),
      DayOfWeekVO.fromTrusted(props.dayOfWeek),
    );
  }
}
