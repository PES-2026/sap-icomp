import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface ScheduleResult extends BaseItem {
  pedagogueId: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentCourse?: string;
  studentEnrollment?: string;
  guestName?: string;
  guestEmail?: string;
  startDate: Date;
  endDate: Date;
  status: ScheduleStatusEnum;
  token?: string;
  reason?: string;
}

export type PaginatedScheduleResult = PaginatedResult<ScheduleResult>;
