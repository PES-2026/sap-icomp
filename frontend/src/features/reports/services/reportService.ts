import api from "@/services/api";
import { attendanceService } from "@/features/attendances/services/attendanceService";
import { studentService } from "@/features/students/services/studentService";
import { ApiError } from "@/services/apiError";
import {
  CreateReportData,
  ReportDetailsResponse,
  ReportInitialData,
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

  async getInitialData(studentId: string): Promise<ReportInitialData> {
    const [student, attendances] = await Promise.all([
      studentService.getStudentById(studentId),
      attendanceService.getAttendancesByStudent(studentId, 1, 1),
    ]);

    // The current backend branch contains the initial-data use case, but the
    // GET /reports/new route is commented out. Until it is exposed, the
    // frontend mirrors the backend create rule and uses the student payload as
    // the source for default potential/difficulties.
    if (attendances.items.length === 0) {
      throw new ApiError(
        "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
        422,
        "NO_COMPLETED_ATTENDANCES",
      );
    }

    return {
      potential: student.potential ?? "",
      difficulties: student.difficulties ?? "",
    };
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
