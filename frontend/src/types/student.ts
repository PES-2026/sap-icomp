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

export type FormErrors = Partial<Record<keyof StudentFormData, string>>;
