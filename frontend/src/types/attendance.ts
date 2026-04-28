export type AttendanceType =
  | "Aprendizagem"
  | "Vulnerabilidade Socioeconômica"
  | "Emocional"
  | "Deficiência"
  | "Orientação Acadêmica"
  | "Outros";

export interface Attendance {
  attendanceId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  course: string;
  period: string;
  attendanceType: AttendanceType;
  attendanceDate: string;
}

export interface AttendanceSummary {
  attendanceId: string;
  attendanceType: string;
  attendanceDate: string;
}

export interface AttendanceTypesFromBackend {
  id: string;
  name: string;
}
