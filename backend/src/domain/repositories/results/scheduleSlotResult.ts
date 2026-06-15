import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { BaseItem } from "@domain/shared/item";

export interface ScheduleSlotResult extends BaseItem {
  pedagogueId: string;
  startDateTime: Date;
  endDateTime: Date;
  attendanceTime: number;
  scheduleId?: string | undefined;
  status: ScheduleSlotStatusEnum;
}
