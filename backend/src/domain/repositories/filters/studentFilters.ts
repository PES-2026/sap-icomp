import { PaginationParams } from "@domain/shared/pagination";

export interface ListStudentFilters {
  name?: string;
  dtBirth?: Date;
  enrollment?: string;
  phoneNumber?: string;
  course?: string;
  lastAttendance?: Date;
  email?: string;
  diagnosis?: string;
  potential?: string;
  difficulties?: string;
}

export type StudentListParams = PaginationParams<"filters", ListStudentFilters>;
