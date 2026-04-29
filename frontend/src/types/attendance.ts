export interface Attendance {
  attendanceId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  course: string;
  period: string;
  attendanceType: string;
  attendanceDate: string;
  generalObservations: string;
}

export interface AttendanceFormData {
  studentId: string;
  date: string;
  type: string;
  demand: string;
  generalObservations: string;
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

export type AttendanceFormErrors = Partial<
  Record<keyof AttendanceFormData, string>
>;
