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
  // the print view can display it when a future backend version provides it.
  pedagogueRegistrationNumber?: string;
  createdAt: string;
  updatedAt: string;
  // Current backend does not implement optimistic concurrency yet. The UI keeps
  // this optional field so the conflict flow can be enabled without reshaping data.
  version?: number;
  // Current backend does not expose report sharing status yet. The delete guard
  // remains optional for the future official sharing workflow.
  shared?: boolean;
  // Current backend only checks if at least one attendance exists when creating.
  // A future backend version can include this count for richer list text.
  includedAttendancesCount?: number;
}

export interface ReportListItemResponse extends ReportIdentifierResponse {
  pedagogueId?: string;
  pedagogueName?: string;
  createdAt?: string;
  updatedAt?: string;
  // Not returned by the current backend report list. Kept for the future
  // sharing workflow that blocks deletion of officially shared reports.
  shared?: boolean;
  // Not returned by the current backend report list. Kept for the future
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
