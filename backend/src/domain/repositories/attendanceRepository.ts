import {
  ListAttendanceRequest,
  ListAttendanceResponse,
} from "../../application/dtos/attendance/listAttendance.dto";
import { Attendance } from "../entities/attendance";

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: ListAttendanceRequest): Promise<ListAttendanceResponse>;
  findById(id: string): Promise<Attendance | null>;
  update(attendance: Attendance): Promise<void>;
}
