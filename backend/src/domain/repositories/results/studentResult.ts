import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface StudentResult extends BaseItem {
  name: string;
  enrollmentId: string;
  dtBirth: Date;
  email: string;
  phoneNumber: string;
  course: string;
  diagnoses: string[];
  potential: string;
  difficulties: string;
  lastAttendance: Date | null;
}

export type PaginatedStudentResult = PaginatedResult<StudentResult>;
