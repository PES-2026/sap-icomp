import { AttendanceType } from "@domain/enums/attendance/attendanceTypeEnum";
import { PaginationParams } from "@domain/shared/pagination";

export interface ListAttendanceFilters {
  studentName?: string;
  studentEnrollment?: string;
  studentCourse?: string;
  attendanceType?: AttendanceType;
  startDate?: Date;
  endDate?: Date;
}

export type AttendanceListParams = PaginationParams<"filters", ListAttendanceFilters>;
