import api from "@/services/api";
import {
  Attendance,
  AttendanceFormData,
  PaginatedAttendancesResponse,
} from "../types/attendance";

export const attendanceService = {
  async getAttendances(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedAttendancesResponse> {
    const response = await api.get<PaginatedAttendancesResponse>(
      "/attendances",
      {
        params: { page, limit },
        fallbackMsg: "Não foi possível obter os atendimentos.",
      },
    );
    return response.data;
  },

  async getAttendancesById(id: string): Promise<Attendance> {
    const response = await api.get<Attendance>(`/attendances/${id}`, {
      fallbackMsg: "Não foi possível obter o atendimento.",
    });
    return response.data;
  },

  async getAttendancesByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedAttendancesResponse> {
    const response = await api.get<PaginatedAttendancesResponse>(
      `/attendances/student/${studentId}`,
      {
        params: { page, limit },
        fallbackMsg: "Não foi possível obter os atendimentos do estudante.",
      },
    );
    return response.data;
  },

  async create(data: AttendanceFormData): Promise<AttendanceFormData> {
    const response = await api.post<AttendanceFormData>("/attendances", data, {
      fallbackMsg: "Não foi possível criar o atendimento.",
    });
    return response.data;
  },

  async update(
    id: string,
    data: Partial<AttendanceFormData>,
  ): Promise<Attendance> {
    const response = await api.put<Attendance>(`/attendances/${id}`, data, {
      fallbackMsg: "Não foi possível atualizar o atendimento.",
    });
    return response.data;
  },

  async removeAttendance(attendanceId: string): Promise<void> {
    await api.post(`/attendances/${attendanceId}/remove`, {
      fallbackMsg: "Não foi possível remover o atendimento.",
    });
  },
};
