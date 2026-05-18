import { Attendance } from "@/features/attendances/types/attendance";
import { Course } from "@/features/courses/types/course";
import { Diagnostic } from "@/features/diagnostics/types/diagnostic";

export interface Student {
  id: string;
  enrollmentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  dtBirth: string;
  diagnoses: Diagnostic[];
  potential: string;
  difficulties: string;
  createdAt: string;
  updatedAt: string;
  removed: boolean;
  course: Course;
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
