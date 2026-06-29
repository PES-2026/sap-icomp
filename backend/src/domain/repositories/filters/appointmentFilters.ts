import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { PaginationParams } from "@domain/shared/pagination";

export interface ListAppointmentFilters {
  status?: AppointmentStatusEnum;
  startDate?: Date;
  endDate?: Date;
  pedagogueId?: string;
  studentName?: string;
  studentEmail?: string;
  studentCourse?: string;
  studentEnrollment?: string;
  guestName?: string;
  guestEmail?: string;
}

export type AppointmentListParams = PaginationParams<"filters", ListAppointmentFilters>;
