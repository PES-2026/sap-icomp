import {
  AttendancesByStudentRequest,
  AttendancesByStudentResponse,
} from "../../application/dtos/attendance/attendancesByStudent.dto";
import {
  ListAttendanceRequest,
  ListAttendanceResponse,
} from "../../application/dtos/attendance/listAttendance.dto";
import { Attendance } from "../entities/attendance";

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: ListAttendanceRequest): Promise<ListAttendanceResponse>;
  findById(id: string): Promise<Attendance | null>;
  findByStudentId(
    params: AttendancesByStudentRequest,
  ): Promise<AttendancesByStudentResponse | null>;
  update(attendance: Attendance): Promise<void>;
  remove(id: string): Promise<void>;
}
