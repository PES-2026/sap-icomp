export const PATHS = {
  students_list: "/admin/students",
  attendances_list: "/admin/attendances",
  register_student: "/admin/students/register",
  register_attendance: (studentId: string) =>
    `/admin/students/${studentId}/attendance/register`,
  visualize_student: (enrollmentId: string) =>
    `/admin/students/${enrollmentId}`,
  edit_student: (enrollmentId: string) =>
    `/admin/students/${enrollmentId}/edit`,
  visualize_attendance: (studentId: string, attendanceId: string) =>
    `/admin/students/${studentId}/attendance/${attendanceId}`,
  edit_attendance: (studentId: string, attendanceId: string) =>
    `/admin/students/${studentId}/attendance/${attendanceId}/edit`,
};
