import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { PaginationParams } from "@domain/shared/pagination";

export interface ListScheduleFilters {
  status?: ScheduleStatusEnum;
  startDate?: Date;
  endDate?: Date;
  pedagogueId?: string;
  studentName?: string;
  studentEmail?: string;
  studentCourse?: string;
  studentEnrollment?: string;
  guestName?: string;
  guestEmail?: string;
  date?: Date;
}

export type ScheduleListParams = PaginationParams<"filters", ListScheduleFilters>;
