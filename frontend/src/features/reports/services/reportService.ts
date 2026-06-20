import { Attendance } from "@/features/attendances/types/attendance";
import api from "@/services/api";
import {
  CreateReportData,
  InterventionReport,
  ReportEligibility,
  UpdateReportData,
} from "../types/report";
import { reportMockService } from "./reportMockService";

const useMock = process.env.NEXT_PUBLIC_REPORTS_MOCK !== "false";

export const reportService = {
  async listByStudent(studentId: string): Promise<InterventionReport[]> {
    if (useMock) return reportMockService.listByStudent(studentId);
    const response = await api.get<InterventionReport[]>(
      `/students/${studentId}/reports`,
      { fallbackMsg: "Não foi possível carregar os relatórios." },
    );
    return response.data;
  },

  async getById(reportId: string): Promise<InterventionReport> {
    if (useMock) return reportMockService.getById(reportId);
    const response = await api.get<InterventionReport>(`/reports/${reportId}`, {
      fallbackMsg: "Não foi possível carregar o relatório.",
    });
    return response.data;
  },

  async getEligibility(
    studentId: string,
    attendances: Attendance[],
  ): Promise<ReportEligibility> {
    if (useMock) return reportMockService.getEligibility(attendances);
    const response = await api.get<ReportEligibility>(
      `/students/${studentId}/reports/eligibility`,
      { fallbackMsg: "Não foi possível verificar a geração do relatório." },
    );
    return response.data;
  },

  async create(
    studentId: string,
    data: CreateReportData,
  ): Promise<InterventionReport> {
    if (useMock) return reportMockService.create(data);
    const response = await api.post<InterventionReport>(
      `/students/${studentId}/reports`,
      {
        technicalOpinion: data.technicalOpinion,
        strategicInterventions: data.strategicInterventions,
        teacherGuidance: data.teacherGuidance,
      },
      { fallbackMsg: "Não foi possível criar o relatório." },
    );
    return response.data;
  },

  async update(
    reportId: string,
    data: UpdateReportData,
  ): Promise<InterventionReport> {
    if (useMock) return reportMockService.update(reportId, data);
    const response = await api.patch<InterventionReport>(
      `/reports/${reportId}`,
      {
        technicalOpinion: data.technicalOpinion,
        strategicInterventions: data.strategicInterventions,
        teacherGuidance: data.teacherGuidance,
        version: data.version,
      },
      { fallbackMsg: "Não foi possível atualizar o relatório." },
    );
    return response.data;
  },

  async remove(reportId: string, password: string): Promise<void> {
    if (useMock) return reportMockService.remove(reportId, password);
    await api.post(
      `/reports/${reportId}/remove`,
      { password },
      {
        fallbackMsg: "Não foi possível excluir o relatório.",
        preserveSessionOn401: true,
      },
    );
  },
};
