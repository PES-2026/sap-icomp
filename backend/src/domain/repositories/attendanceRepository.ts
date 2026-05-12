import { Attendance } from "../entities/attendance";

import { AttendanceListParams } from "./filters/attendanceFilters";

// Domain representation of a paginated list of attendances
export interface PaginatedAttendanceResult {
  data: Attendance[];
  total: number;
}

export interface FindByStudentParams {
  studentId: string;
  page?: number;
  limit?: number;
}

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: AttendanceListParams): Promise<PaginatedAttendanceResult>;
  findById(id: string): Promise<Attendance | null>;
  findByStudentId(params: FindByStudentParams): Promise<PaginatedAttendanceResult | null>;
  update(attendance: Attendance): Promise<void>;
  remove(id: string): Promise<void>;
}
