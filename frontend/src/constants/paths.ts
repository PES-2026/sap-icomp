export const PATHS = {
  students_list: "/admin/students",
  attendances_list: "/admin/attendances",
  register_student: "/admin/students/register",
  register_attendance: "/admin/attendances/register",
  visualize_student: (enrollmentId: string) =>
    `/admin/students/${enrollmentId}`,
  edit_student: (enrollmentId: string) =>
    `/admin/students/${enrollmentId}/edit`,
  visualize_attendance: (attendanceId: string) =>
    `/admin/attendances/${attendanceId}`,
  edit_attendance: (attendanceId: string) =>
    `/admin/attendances/${attendanceId}/edit`,
};
