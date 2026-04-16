export const PATHS = {
  students_list: "/admin/students",
  register_student: "/admin/students/register",
  visualize_student: (enrollmentId: string) =>
    `/admin/students/${enrollmentId}`,
  edit_student: (enrollmentId: string) =>
    `/admin/students/${enrollmentId}/edit`,
};
