export interface ReportContent {
  condition: string;
  potential: string;
  difficulties: string;
  recommendation: string;
  conclusion: string;
}

export interface ReportDetailsResponse extends ReportContent {
  id?: string;
  reportId?: string;
  externalId?: string;
  studentInformation: string;
  pedagogueName: string;
  pedagogueRegistrationNumber?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  shared?: boolean;
  includedAttendancesCount?: number;
}

export interface ReportSummary {
  id: string;
  pedagogueName: string;
  createdAt: string;
  updatedAt: string;
  shared?: boolean;
  includedAttendancesCount?: number;
}

export interface ReportInitialData {
  potential: string;
  difficulties: string;
}

export interface CreateReportData extends ReportContent {
  pedagogueId: string;
}

export type UpdateReportData = CreateReportData;

export interface ReportMutationResponse extends Partial<ReportDetailsResponse> {
  id?: string;
  reportId?: string;
  externalId?: string;
}
