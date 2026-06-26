export interface ReportContent {
  condition: string;
  potential: string;
  difficulties: string;
  recommendation: string;
  conclusion: string;
}

export interface ReportIdentifierResponse {
  id?: string;
  reportId?: string;
  externalId?: string;
}

export interface ReportDetailsResponse
  extends ReportContent,
    ReportIdentifierResponse {
  studentInformation: string;
  pedagogueName: string;
  pedagogueRegistrationNumber?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  shared?: boolean;
  includedAttendancesCount?: number;
}

export interface ReportListItemResponse extends ReportIdentifierResponse {
  pedagogueName?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface PaginatedReportsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: ReportListItemResponse[];
}

export interface ReportInitialData {
  potential: string;
  difficulties: string;
}

export interface CreateReportData extends ReportContent {
  pedagogueId: string;
}

export type UpdateReportData = CreateReportData;

export interface ReportMutationResponse
  extends Partial<ReportDetailsResponse>,
    ReportIdentifierResponse {}
