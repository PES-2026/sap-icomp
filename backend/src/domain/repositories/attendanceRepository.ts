import { Attendance } from "../entities/attendance";
import {
  AttendancesByStudentRequest,
  AttendancesByStudentResponse,
} from "@application/dtos/attendance/attendancesByStudentDto";
import { AttendanceListParams } from "./filters/attendanceFilters";
import { PaginatedResult } from "@domain/shared/pagination";

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: AttendanceListParams): Promise<PaginatedResult<Attendance>>;
  findById(id: string): Promise<Attendance | null>;
  findByStudentId(params: AttendancesByStudentRequest): Promise<AttendancesByStudentResponse | null>;
  update(attendance: Attendance): Promise<void>;
  remove(id: string): Promise<void>;
}
