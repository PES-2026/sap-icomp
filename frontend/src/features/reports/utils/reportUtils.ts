import {
  ReportIdentifierResponse,
  ReportListItemResponse,
  ReportSummary,
} from "../types/report";

export const getReportId = (report: ReportIdentifierResponse): string => {
  const id = report.id ?? report.reportId ?? report.externalId;
  if (!id) {
    throw new Error("O backend não retornou o identificador do relatório.");
  }
  return id;
};

export const formatReportsSummary = (
  reports: ReportListItemResponse[],
): ReportSummary[] =>
  reports.map((report) => ({
    id: getReportId(report),
    pedagogueName: report.pedagogueName ?? "Pedagoga não informada",
    createdAt: report.createdAt ?? "",
    updatedAt: report.updatedAt ?? report.createdAt ?? "",
    shared: report.shared,
    includedAttendancesCount: report.includedAttendancesCount,
  }));
