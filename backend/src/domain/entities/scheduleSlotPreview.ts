import { Result } from "@domain/shared/result";

import { DurationVO } from "../valueObjects/scheduleSlot/duration";
import { ScheduleSlotPreviewStatusVO } from "../valueObjects/scheduleSlot/scheduleSlotPreviewStatus";
import { DateVO } from "../valueObjects/shared/date";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type ScheduleSlotPreviewProps = {
  id?: string | undefined;
  pedagogueId: string;
  startDateTime: Date;
  endDateTime: Date;
  attendanceTime: number;
  status: string;
};

export class ScheduleSlotPreview {
  constructor(
    public readonly id: ExternalIdVO | undefined,
    public readonly pedagogueId: ExternalIdVO,
    public readonly startDateTime: DateVO,
    public readonly endDateTime: DateVO,
    public readonly attendanceTime: DurationVO,
    public readonly status: ScheduleSlotPreviewStatusVO,
  ) {}

  static create(props: ScheduleSlotPreviewProps): Result<ScheduleSlotPreview> {
    const externalId = props.id ? ExternalIdVO.from(props.id) : undefined;
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const startDateTime = DateVO.create(props.startDateTime);
    const endDateTime = DateVO.create(props.endDateTime);
    const attendanceTime = DurationVO.create(props.attendanceTime);
    const status = ScheduleSlotPreviewStatusVO.create(props.status);

    const results = [externalId, pedagogueId, startDateTime, endDateTime, attendanceTime, status];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail(result.error!);
      }
    }

    return Result.ok<ScheduleSlotPreview>(
      new ScheduleSlotPreview(
        externalId?.getValue(),
        pedagogueId.getValue(),
        startDateTime.getValue(),
        endDateTime.getValue(),
        attendanceTime.getValue(),
        status.getValue(),
      ),
    );
  }
}
