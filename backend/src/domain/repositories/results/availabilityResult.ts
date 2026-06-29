import { AvailabilityStatusEnum } from "@domain/enum/availabilityStatus";
import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface AvailabilityResult extends BaseItem {
  pedagogueId: string;
  startDateTime: Date;
  endDateTime: Date;
  attendanceTime: number;
  status: AvailabilityStatusEnum;
  weekDay: DaysOfWeekEnum;
  appointmentId?: string | undefined;
}

export type PaginatedAvailabilityResult = PaginatedResult<AvailabilityResult>;
