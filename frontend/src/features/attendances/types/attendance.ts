import { AttendanceType } from "@/features/attendance-types/types/attendanceType";
import { Student } from "@/features/students/types/student";

export interface Attendance {
  id: string;
  student: Student;
  date: string;
  type: AttendanceType;
  demand: string;
  generalObservations: string;
  createdAt: Date;
  updatedAt: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface AttendanceFormData {
  studentId: string;
  date: string;
  typeId: string;
  demand: string;
  generalObservations: string;
}

export interface AttendanceSummary {
  attendanceId: string;
  attendanceType: string;
  attendanceDate: string;
}

export interface PaginatedAttendancesResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Attendance[];
}

export type AttendanceFormErrors = Partial<
  Record<keyof AttendanceFormData, string>
>;
