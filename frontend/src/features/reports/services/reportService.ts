import api from "@/services/api";
import {
  CreateReportData,
  PaginatedReportsResponse,
  ReportDetailsResponse,
  ReportInitialData,
  ReportMutationResponse,
  UpdateReportData,
} from "../types/report";
import { reportMockService } from "./reportMockService";

export const REPORTS_MOCK_ENABLED =
  process.env.NEXT_PUBLIC_REPORTS_MOCK === "true";

export const reportService = {
  async listByStudent(studentId: string): Promise<PaginatedReportsResponse> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.listByStudent(studentId);
    }

    const response = await api.get<PaginatedReportsResponse>(
      `/pedagogue/students/${encodeURIComponent(studentId)}/reports`,
      {
        fallbackMsg: "Não foi possível carregar os relatórios.",
      },
    );
    return response.data;
  },

  async getById(
    studentId: string,
    reportId: string,
  ): Promise<ReportDetailsResponse> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.getById(studentId, reportId);
    }

    const response = await api.get<ReportDetailsResponse>(
      `/pedagogue/students/${encodeURIComponent(studentId)}/reports/${encodeURIComponent(reportId)}`,
      { fallbackMsg: "Não foi possível carregar o relatório." },
    );
    return response.data;
  },

  async getInitialData(studentId: string): Promise<ReportInitialData> {
    if (REPORTS_MOCK_ENABLED) {
      return reportMockService.getInitialData(studentId);
    }

    const response = await api.get<ReportInitialData>(
      `/pedagogue/students/${encodeURIComponent(studentId)}/reports/new`,
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
      `/pedagogue/students/${encodeURIComponent(studentId)}/reports/new`,
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
      `/pedagogue/students/${encodeURIComponent(studentId)}/reports/${encodeURIComponent(reportId)}/edit`,
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
      `/pedagogue/students/${encodeURIComponent(studentId)}/reports/${encodeURIComponent(reportId)}/remove`,
      { password },
      {
        fallbackMsg: "Não foi possível excluir o relatório.",
        preserveSessionOn401: true,
      },
    );
  },
};
