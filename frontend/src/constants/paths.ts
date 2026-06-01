import { Role } from "@/features/login/types/login";

export const RoleMap: { [K in Role as K]: Lowercase<K> } = {
  PEDAGOGUE: "pedagogue",
  PROFESSOR: "professor",
} as const;

export const PATHS = {
  // Authenticate
  login: "/login",
  register: "/register",
  forgot_password: "/forgot-password",

  // Main Page Roles
  pedagogue: `/${RoleMap.PEDAGOGUE}`,
  professor: `/${RoleMap.PROFESSOR}`,

  // Scheduling
  scheduling: "/scheduling",

  // Students
  students_list: `/${RoleMap.PEDAGOGUE}/students`,
  register_student: `/${RoleMap.PEDAGOGUE}/students/register`,
  visualize_student: (enrollmentId: string) =>
    `/${RoleMap.PEDAGOGUE}/students/${enrollmentId}`,
  edit_student: (enrollmentId: string) =>
    `/${RoleMap.PEDAGOGUE}/students/${enrollmentId}/edit`,

  // Attendances
  attendances_list: `/${RoleMap.PEDAGOGUE}/attendances`,
  register_attendance: (studentId: string) =>
    `/${RoleMap.PEDAGOGUE}/students/${studentId}/attendance/register`,
  visualize_attendance: (studentId: string, attendanceId: string) =>
    `/${RoleMap.PEDAGOGUE}/students/${studentId}/attendance/${attendanceId}`,
  edit_attendance: (studentId: string, attendanceId: string) =>
    `/${RoleMap.PEDAGOGUE}/students/${studentId}/attendance/${attendanceId}/edit`,

  // Users
  users_list: `/${RoleMap.PEDAGOGUE}/users`,
  users_pending: `/${RoleMap.PEDAGOGUE}/users/pending`,

  visualize_settings: `/${RoleMap.PEDAGOGUE}/settings`,
};
