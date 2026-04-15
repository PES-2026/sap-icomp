import { CourseAcronym, CourseName } from "./course";
import { SpecialNeed } from "./specialNeed";

export interface Student {
  enrollmentId: string;
  fullName: string;
  course: CourseAcronym;
  period: number;
  lastAppointment: string;
  activeNeed: SpecialNeed;
}

export interface StudentFormData {
  studentName: string;
  registration: string;
  birthDate: string;
  email: string;
  phone: string;
  course: CourseName;
  diagnosis: string;
  potentialities: string;
  demandsAndBarriers: string;
}

export interface NewStudent {
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
  reatedAt: string;
  updatedAt: string;
  removed: boolean;
  courseId: string;
}

export interface NewStudentFormData {
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

export type FormErrors = Partial<Record<keyof NewStudentFormData, string>>;
