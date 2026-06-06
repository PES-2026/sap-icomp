import { Result } from "@domain/shared/result";

import { ScheduleSlotStatusEnum } from "../enum/scheduleSlotStatus";
import { DateInput, DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type ScheduleSlotProps = {
  id?: string;
  scheduleId: string;
  startDateTime: DateInput;
  endDateTime: DateInput;
  status: ScheduleSlotStatusEnum;
  attendanceId?: string;
};

export class ScheduleSlot {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly scheduleId: ExternalIdVO,
    public startDateTime: DateVO,
    public endDateTime: DateVO,
    public status: ScheduleSlotStatusEnum,
    public attendanceId?: ExternalIdVO,
  ) {}

  static create(props: ScheduleSlotProps): Result<ScheduleSlot> {
    const externalId = ExternalIdVO.create();
    const scheduleId = ExternalIdVO.from(props.scheduleId);
    const startDateTime = DateVO.create(props.startDateTime);
    const endDateTime = DateVO.create(props.endDateTime);
    const attendanceId = props.attendanceId ? ExternalIdVO.from(props.attendanceId) : undefined;

    const results = [externalId, scheduleId, startDateTime, endDateTime, attendanceId];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<ScheduleSlot>(result.error!);
      }
    }

    return Result.ok<ScheduleSlot>(
      new ScheduleSlot(
        externalId.getValue(),
        scheduleId.getValue(),
        startDateTime.getValue(),
        endDateTime.getValue(),
        props.status,
        attendanceId?.getValue() ?? undefined,
      ),
    );
  }

  static rehydrate(props: ScheduleSlotProps): ScheduleSlot {
    return new ScheduleSlot(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.scheduleId),
      DateVO.fromTrusted(new Date(props.startDateTime as string | Date)),
      DateVO.fromTrusted(new Date(props.endDateTime as string | Date)),
      props.status,
      props.attendanceId ? ExternalIdVO.fromTrusted(props.attendanceId) : undefined,
    );
  }
}
