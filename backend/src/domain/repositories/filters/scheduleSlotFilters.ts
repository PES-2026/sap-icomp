import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { PaginationParams } from "@domain/shared/pagination";

export interface ListScheduleSlotFilters {
  status?: ScheduleSlotStatusEnum;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  attendanceTime?: number;
  pedagogueId?: string;
}

export type ScheduleSlotListParams = PaginationParams<"filters", ListScheduleSlotFilters>;
