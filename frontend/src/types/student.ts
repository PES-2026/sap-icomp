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
  courseId: string;
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

export type FormErrors = Partial<Record<keyof StudentFormData, string>>;
