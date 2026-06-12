export type ManagedScheduleStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED";

export type ManagedSchedulePeriod =
  | "UPCOMING"
  | "THIS_WEEK"
  | "NEXT_15_DAYS"
  | "CUSTOM";

export interface ManagedSchedule {
  id: string;
  responsiblePedagogueId: string;
  status: ManagedScheduleStatus;
  startDateTime: string;
  endDateTime: string;
  reason: string;
  rejectionReason?: string;
  requestedAt: string;
  student: {
    id?: string;
    name: string;
    enrollmentId: string;
    email: string;
    phoneNumber?: string;
  };
  course: {
    id: string;
    name: string;
    acronym: string;
  };
}

export interface ManagedScheduleFilters {
  startDate: string;
  endDate?: string;
  statuses: ManagedScheduleStatus[];
  pedagogueId?: string;
}

export interface ManagedScheduleActionResult {
  schedule: ManagedSchedule;
  outcome: "CONFIRMED" | "REJECTED" | "CANCELLED";
  emailNotificationQueued: boolean;
  slotReleased: boolean;
}
