import api from "@/services/api";
import { attendanceService } from "@/features/attendances/services/attendanceService";
import { ApiError } from "@/services/apiError";
import {
  CreateReportData,
  ReportDetailsResponse,
  ReportListItemResponse,
  ReportMutationResponse,
  UpdateReportData,
} from "../types/report";

export const reportService = {
  async listByStudent(studentId: string): Promise<ReportListItemResponse[]> {
    const response = await api.get<ReportListItemResponse[]>(
      `/reports/student/${encodeURIComponent(studentId)}`,
      {
        fallbackMsg: "Não foi possível carregar os relatórios.",
      },
    );

    return response.data;
  },

  async getById(reportId: string): Promise<ReportDetailsResponse> {
    const response = await api.get<ReportDetailsResponse>(
      `/reports/${encodeURIComponent(reportId)}`,
      {
        fallbackMsg: "Não foi possível carregar o relatório.",
      },
    );
    return response.data;
  },

  async checkEligibility(studentId: string): Promise<void> {
    const attendances = await attendanceService.getAttendancesByStudent(
      studentId,
      1,
      1,
    );

    // The backend enforces this rule on create, but the frontend checks it
    // before showing the form so the user gets feedback earlier.
    if (attendances.items.length === 0) {
      throw new ApiError(
        "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
        422,
        "NO_COMPLETED_ATTENDANCES",
      );
    }
  },

  async create(
    studentId: string,
    data: CreateReportData,
  ): Promise<ReportMutationResponse> {
    const response = await api.post<ReportMutationResponse>(
      "/reports",
      { ...data, studentId },
      { fallbackMsg: "Não foi possível criar o relatório." },
    );
    return response.data;
  },

  async update(
    studentId: string,
    reportId: string,
    data: UpdateReportData,
  ): Promise<ReportMutationResponse> {
    const response = await api.put<ReportMutationResponse>(
      `/reports/${encodeURIComponent(reportId)}`,
      { ...data, studentId },
      { fallbackMsg: "Não foi possível atualizar o relatório." },
    );
    return response.data;
  },

  async remove(reportId: string, password: string): Promise<void> {
    await api.delete(`/reports/${encodeURIComponent(reportId)}`, {
      data: { password },
      fallbackMsg: "Não foi possível excluir o relatório.",
      preserveSessionOn401: true,
    });
  },
};
