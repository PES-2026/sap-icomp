import { AttendanceTypeEnum } from "@domain/enums/attendance/attendanceTypeEnum";
import { PaginatedRequest, PaginatedResult } from "@domain/shared/pagination";

import { Attendance } from "../entities/attendance";

export interface ListAttendanceFilters {
  studentName?: string;
  studentEnrollment?: string;
  studentCourse?: string;
  attendanceType?: AttendanceTypeEnum;
  startDate?: Date;
  endDate?: Date;
}

export interface AttendanceItemResult {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  course: string;
  attendanceType: string;
  attendanceDate: Date;
}

export type ListAttendanceRequest = PaginatedRequest<"filters", ListAttendanceFilters>;
export type ListAttendanceResponse = PaginatedResult<AttendanceItemResult>;

export type AttendancesByStudentResponse = PaginatedResult<AttendanceItemResult>;
export type AttendancesByStudentRequest = PaginatedRequest<"studentId", string>;

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: ListAttendanceRequest): Promise<ListAttendanceResponse>;
  findById(id: string): Promise<Attendance | null>;
  findByStudentId(params: AttendancesByStudentRequest): Promise<AttendancesByStudentResponse | null>;
  update(attendance: Attendance): Promise<void>;
  remove(id: string): Promise<void>;
}
