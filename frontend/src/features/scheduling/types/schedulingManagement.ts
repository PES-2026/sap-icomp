import { Course } from "@/features/courses/types/course";
import { SchedulingSlot } from "./scheduling";

export type ManagedSchedulingStatus = "PENDING" | "APPROVED" | "CANCELED";

export type ManagedSchedulingPeriod =
  | "UPCOMING"
  | "THIS_WEEK"
  | "NEXT_15_DAYS"
  | "CUSTOM";

export interface ManagedScheduling {
  id: string;
  pedagogueId: string;

  enrollmentId: number;
  studentId?: string;
  studentName: string;
  email: string;
  course: Course;

  status: ManagedSchedulingStatus;
  reason: string;
  slot: SchedulingSlot;
  rejectionReason?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ManagedSchedulingFilters {
  startDate: string;
  endDate?: string;
  statuses: ManagedSchedulingStatus[];
  pedagogueId?: string;
}

export interface ManagedSchedulingActionResult {
  scheduling: ManagedScheduling;
  outcome: "CONFIRMED" | "REJECTED" | "CANCELED";
  emailNotificationQueued: boolean;
  slotReleased: boolean;
}
