import { AttendanceType } from "../../../domain/enums/attendance/attendanceType.enum";

export interface CreateAttendanceDTO {
  studentId: string;
  date: Date;
  type: AttendanceType;
  demand: string;
  generalObservations: string;
}
