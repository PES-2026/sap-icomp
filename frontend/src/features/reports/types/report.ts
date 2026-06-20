export interface ReportStudentSnapshot {
  id: string;
  name: string;
  enrollmentId: string;
  course: {
    id: string;
    name: string;
  };
}

export interface ReportPedagogueSnapshot {
  id: string;
  name: string;
}

export interface InterventionReport {
  id: string;
  student: ReportStudentSnapshot;
  author: ReportPedagogueSnapshot;
  lastModifiedBy: ReportPedagogueSnapshot;
  technicalOpinion: string;
  strategicInterventions: string;
  teacherGuidance: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  shared: boolean;
  includedAttendancesCount: number;
  deletedAt?: string;
}

export interface ReportFormData {
  technicalOpinion: string;
  strategicInterventions: string;
  teacherGuidance: string;
}

export interface CreateReportData extends ReportFormData {
  student: ReportStudentSnapshot;
  author: ReportPedagogueSnapshot;
  includedAttendancesCount: number;
}

export interface UpdateReportData extends ReportFormData {
  version: number;
  lastModifiedBy: ReportPedagogueSnapshot;
}

export interface ReportEligibility {
  canCreate: boolean;
  completedAttendancesCount: number;
  reason?: "NO_COMPLETED_ATTENDANCES";
}
