import api from "@/services/api";
import {
  AttendanceType,
  AttendanceTypeResponse,
} from "../types/attendanceType";

export const attendanceTypeService = {
  async getAll(
    page: number = 1,
    limit: number = 100,
  ): Promise<AttendanceTypeResponse> {
    const response = await api.get<AttendanceTypeResponse>(
      "/attendance-types",
      {
        params: { page, limit },
        fallbackMsg:
          "Não foi possível carregar a lista de tipos de atendimento.",
      },
    );
    return response.data;
  },

  async getById(id: string): Promise<AttendanceType> {
    const response = await api.get<AttendanceType>(`/attendance-types/${id}`, {
      fallbackMsg:
        "Não foi possível carregar os detalhes do tipo de atendimento.",
    });
    return response.data;
  },

  async create(data: { name: string }): Promise<AttendanceType> {
    const response = await api.post<AttendanceType>("/attendance-types", data, {
      fallbackMsg: "Ocorreu um erro ao tentar criar o tipo de atendimento.",
    });
    return response.data;
  },

  async update(id: string, data: { name: string }): Promise<AttendanceType> {
    const response = await api.put<AttendanceType>(
      `/attendance-types/${id}`,
      data,
      {
        fallbackMsg:
          "Ocorreu um erro ao tentar atualizar o tipo de atendimento.",
      },
    );
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/attendance-types/${id}`, {
      fallbackMsg: "Ocorreu um erro ao tentar remover o tipo de atendimento.",
    });
  },
};
