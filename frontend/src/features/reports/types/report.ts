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
  // Not returned by the current backend report contract. Kept optional because
  // the print view can display it when a mock or future backend version provides it.
  pedagogueRegistrationNumber?: string;
  createdAt: string;
  updatedAt: string;
  // Current backend does not implement optimistic concurrency yet. The UI keeps
  // this optional field so the conflict flow can be enabled without reshaping data.
  version?: number;
  // Current backend does not expose report sharing status yet. The delete guard
  // remains optional for the mock/future official sharing workflow.
  shared?: boolean;
  // Current backend only checks if at least one attendance exists when creating.
  // The mock includes this count for richer list text, so the frontend keeps it optional.
  includedAttendancesCount?: number;
}

export interface ReportListItemResponse extends ReportIdentifierResponse {
  pedagogueId?: string;
  pedagogueName?: string;
  createdAt?: string;
  updatedAt?: string;
  // Not returned by the current backend report list. Kept for the mock/future
  // sharing workflow that blocks deletion of officially shared reports.
  shared?: boolean;
  // Not returned by the current backend report list. Kept for the mock/future
  // UX that displays how many attendances were included in a report.
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
  // Mock-only list shape. The current backend report list returns a plain
  // ReportListItemResponse[] array, and the service exposes that raw shape.
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
