import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

import { CourseItem } from "./courseResult";
import { DiagnosisResult } from "./diagnosisResult";

export interface StudentResult extends BaseItem {
  name: string;
  enrollmentId: string;
  dtBirth: Date;
  email: string;
  phoneNumber: string;
  course: CourseItem;
  diagnoses: DiagnosisResult[];
  potential: string;
  difficulties: string;
  lastAttendance: Date | null;
}

export type PaginatedStudentResult = PaginatedResult<StudentResult>;
