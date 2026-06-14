import { Result } from "@domain/shared/result";
import { DurationVO } from "@domain/valueObjects/scheduleSlot/duration";
import { ScheduleSlotStatusVO } from "@domain/valueObjects/scheduleSlot/scheduleSlotStatus";

import { ScheduleSlotStatusEnum } from "../enum/scheduleSlotStatus";
import { DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type ScheduleSlotProps = {
  id?: string | undefined;
  startDateTime: Date;
  endDateTime: Date;
  status: ScheduleSlotStatusEnum;
  attendanceTime: number;
  pedagogueId: string;
  appointmentId?: string | undefined;
};

export class ScheduleSlot {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly pedagogueId: ExternalIdVO,
    public startDateTime: DateVO,
    public endDateTime: DateVO,
    public attendanceTime: DurationVO,
    public status: ScheduleSlotStatusVO,
    public appointmentId?: ExternalIdVO,
  ) {}

  static create(props: ScheduleSlotProps): Result<ScheduleSlot> {
    const externalId = ExternalIdVO.create();
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const startDateTime = DateVO.create(props.startDateTime);
    const endDateTime = DateVO.create(props.endDateTime);
    const attendanceTime = DurationVO.create(props.attendanceTime);
    const status = ScheduleSlotStatusVO.from(props.status);
    const appointmentId = props.appointmentId ? ExternalIdVO.from(props.appointmentId) : undefined;

    const results = [externalId, pedagogueId, startDateTime, endDateTime, attendanceTime, appointmentId];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<ScheduleSlot>(result.error!);
      }
    }

    return Result.ok<ScheduleSlot>(
      new ScheduleSlot(
        externalId.getValue(),
        pedagogueId.getValue(),
        startDateTime.getValue(),
        endDateTime.getValue(),
        attendanceTime.getValue(),
        status.getValue(),
        appointmentId?.getValue() ?? undefined,
      ),
    );
  }

  static rehydrate(props: ScheduleSlotProps): ScheduleSlot {
    return new ScheduleSlot(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      DateVO.fromTrusted(props.startDateTime),
      DateVO.fromTrusted(props.endDateTime),
      DurationVO.fromTrusted(props.attendanceTime),
      ScheduleSlotStatusVO.fromTrusted(props.status),
      props.appointmentId ? ExternalIdVO.fromTrusted(props.appointmentId) : undefined,
    );
  }
}
