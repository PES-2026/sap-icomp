import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface ScheduleSlotResult extends BaseItem {
  pedagogueId: string;
  startDateTime: Date;
  endDateTime: Date;
  attendanceTime: number;
  scheduleId?: string | undefined;
  status: ScheduleSlotStatusEnum;
}

export type PaginatedScheduleSlotResult = PaginatedResult<ScheduleSlotResult>;
