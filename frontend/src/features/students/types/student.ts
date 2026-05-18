import { Attendance } from "@/features/attendances/types/attendance";

export interface Student {
  id: string;
  enrollmentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  dtBirth: string;
  diagnosis: string;
  potential: string;
  difficulties: string;
  createdAt: string;
  updatedAt: string;
  removed: boolean;
  course: string;
  lastAttendance: Attendance;
}

export interface StudentFormData {
  id: string;
  enrollmentId: string;
  name: string;
  dtBirth: string;
  email: string;
  phoneNumber: string;
  courseId: string;
  diagnoses: string[];
  potential: string;
  difficulties: string;
}

export interface StudentResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Student[];
}

export type FormErrors = Partial<Record<keyof StudentFormData, string>>;
