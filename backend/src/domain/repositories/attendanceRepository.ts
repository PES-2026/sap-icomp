import { Attendance } from "../entities/attendance";
import {
  AttendancesByStudentRequest,
  AttendancesByStudentResponse,
} from "@application/dtos/attendance/attendancesByStudentDto";
import { AttendanceListParams } from "./filters/attendanceFilters";
import { ListAttendanceResponse } from "@application/dtos/attendance/listAttendanceDto";

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: AttendanceListParams): Promise<ListAttendanceResponse>;
  findById(id: string): Promise<Attendance | null>;
  findByStudentId(params: AttendancesByStudentRequest): Promise<AttendancesByStudentResponse | null>;
  update(attendance: Attendance): Promise<void>;
  remove(id: string): Promise<void>;
}
