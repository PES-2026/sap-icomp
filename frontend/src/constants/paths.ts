import { Role } from "@/features/login/types/login";

export const RoleMap: { [K in Role as K]: Lowercase<K> } = {
  Pedagogue: "pedagogue",
  Professor: "professor",
} as const;

export const PATHS = {
  // Authenticate
  login: "/login",
  register: "/register",
  forgot_password: "/forgot-password",

  // Main Page Roles
  pedagogue: `/${RoleMap.Pedagogue}`,
  professor: `/${RoleMap.Professor}`,

  // Scheduling
  scheduling: "/scheduling",

  // Students
  students_list: `/${RoleMap.Pedagogue}/students`,
  register_student: `/${RoleMap.Pedagogue}/students/register`,
  visualize_student: (enrollmentId: string) =>
    `/${RoleMap.Pedagogue}/students/${enrollmentId}`,
  edit_student: (enrollmentId: string) =>
    `/${RoleMap.Pedagogue}/students/${enrollmentId}/edit`,

  // Attendances
  attendances_list: `/${RoleMap.Pedagogue}/attendances`,
  register_attendance: (studentId: string) =>
    `/${RoleMap.Pedagogue}/students/${studentId}/attendance/register`,
  visualize_attendance: (studentId: string, attendanceId: string) =>
    `/${RoleMap.Pedagogue}/students/${studentId}/attendance/${attendanceId}`,
  edit_attendance: (studentId: string, attendanceId: string) =>
    `/${RoleMap.Pedagogue}/students/${studentId}/attendance/${attendanceId}/edit`,
  visualize_settings: `/${RoleMap.Pedagogue}/settings`,
};
