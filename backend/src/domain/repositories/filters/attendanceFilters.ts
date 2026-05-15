import { PaginationParams } from "@domain/shared/pagination";

export interface ListAttendanceFilters {
  studentName?: string;
  studentEnrollment?: string;
  studentCourse?: string;
  attendanceType?: string;
  startDate?: Date;
  endDate?: Date;
}

export type AttendanceListParams = PaginationParams<"filters", ListAttendanceFilters>;
