import api from "@/services/api";
import {
  CreateReportData,
  ReportDetailsResponse,
  ReportInitialData,
  ReportMutationResponse,
  ReportSummary,
  UpdateReportData,
} from "../types/report";
import { reportMockService } from "./reportMockService";

export const REPORTS_MOCK_ENABLED =
  process.env.NEXT_PUBLIC_REPORTS_MOCK === "true";

const studentReportsPath = (studentId: string) =>
  `/pedagogue/students/${encodeURIComponent(studentId)}/reports`;

export const getReportId = (report: ReportMutationResponse): string => {
  const id = report.id ?? report.reportId ?? report.externalId;
  if (!id) {
    throw new Error("O backend não retornou o identificador do relatório.");
  }
  return id;
};

export const reportService = {
  async listByStudent(studentId: string): Promise<ReportSummary[]> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.listByStudent(studentId);
    }

    const response = await api.get<
      ReportMutationResponse[] | { items: ReportMutationResponse[] }
    >(studentReportsPath(studentId), {
      fallbackMsg: "Não foi possível carregar os relatórios.",
    });
    const reports = Array.isArray(response.data)
      ? response.data
      : response.data.items;

    return reports.map((report) => ({
      id: getReportId(report),
      pedagogueName: report.pedagogueName ?? "Pedagoga não informada",
      createdAt: report.createdAt ?? "",
      updatedAt: report.updatedAt ?? report.createdAt ?? "",
      shared: report.shared,
      includedAttendancesCount: report.includedAttendancesCount,
    }));
  },

  async getById(
    studentId: string,
    reportId: string,
  ): Promise<ReportDetailsResponse> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.getById(studentId, reportId);
    }

    const response = await api.get<ReportDetailsResponse>(
      `${studentReportsPath(studentId)}/${encodeURIComponent(reportId)}`,
      { fallbackMsg: "Não foi possível carregar o relatório." },
    );
    return response.data;
  },

  async getInitialData(studentId: string): Promise<ReportInitialData> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.getInitialData(studentId);
    }

    const response = await api.get<ReportInitialData>(
      `${studentReportsPath(studentId)}/new`,
      {
        fallbackMsg: "Não foi possível iniciar a criação do relatório.",
      },
    );
    return response.data;
  },

  async create(
    studentId: string,
    data: CreateReportData,
  ): Promise<ReportMutationResponse> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.create(studentId, data);
    }

    const response = await api.post<ReportMutationResponse>(
      `${studentReportsPath(studentId)}/new`,
      data,
      { fallbackMsg: "Não foi possível criar o relatório." },
    );
    return response.data;
  },

  async update(
    studentId: string,
    reportId: string,
    data: UpdateReportData,
  ): Promise<ReportMutationResponse> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.update(studentId, reportId, data);
    }

    const response = await api.post<ReportMutationResponse>(
      `${studentReportsPath(studentId)}/${encodeURIComponent(reportId)}/edit`,
      data,
      { fallbackMsg: "Não foi possível atualizar o relatório." },
    );
    return response.data;
  },

  async remove(
    studentId: string,
    reportId: string,
    password: string,
  ): Promise<void> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.remove(studentId, reportId, password);
    }

    await api.post(
      `${studentReportsPath(studentId)}/${encodeURIComponent(reportId)}/remove`,
      { password },
      {
        fallbackMsg: "Não foi possível excluir o relatório.",
        preserveSessionOn401: true,
      },
    );
  },
};
