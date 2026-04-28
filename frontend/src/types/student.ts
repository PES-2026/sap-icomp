import { AttendanceSummary } from "./attendance";

export interface Student {
  internalId: number;
  externalId: string;
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
}

export interface StudentFormData {
  externalId: string;
  enrollmentId: string;
  name: string;
  dtBirth: string;
  email: string;
  phoneNumber: string;
  courseId: string;
  diagnosis: string;
  potential: string;
  difficulties: string;
}

export interface StudentAttendance extends Student {
  attendances: AttendanceSummary[];
}

export type FormErrors = Partial<Record<keyof StudentFormData, string>>;
