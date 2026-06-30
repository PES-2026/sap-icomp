import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { AppointmentType } from "@domain/enum/appointmentType";
import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface AppointmentResult extends BaseItem {
  pedagogueId: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentCourse: string;
  studentEnrollment: string;
  availabilityId: string;
  startDate: Date;
  endDate: Date;
  attendanceTime: number;
  status: AppointmentStatusEnum;
  token: string;
  reason?: string;
  type: AppointmentType;
}

export type PaginatedAppointmentResult = PaginatedResult<AppointmentResult>;
