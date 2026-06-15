import { BaseItem } from "@domain/shared/item";

export interface ScheduleResult extends BaseItem {
  pedagogueId: string;
  studentId?: string;
  guestName?: string;
  guestEmail?: string;
  startDate: Date;
  endDate: Date;
  token: string;
  reason?: string;
}
