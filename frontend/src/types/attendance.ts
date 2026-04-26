export interface Attendance {
  attendanceId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  course: string;
  period: string;
  attendanceType: string;
  attendanceDate: string;
}

export interface AttendanceSummary {
  attendanceId: string;
  attendanceType: string;
  attendanceDate: string;
}
