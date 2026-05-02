import api from "@/services/api";
import { AttendanceTypesFromBackend } from "../types/attendanceType";

export const attendanceTypeService = {
  async get(): Promise<AttendanceTypesFromBackend[]> {
    try {
      const response =
        await api.get<AttendanceTypesFromBackend[]>("/attendance-types");
      return response.data;
    } catch {
      return [
        { id: "1", name: "Aprendizado" },
        { id: "2", name: "Vulnerabilidade Socioeconômica" },
        { id: "3", name: "Emocional" },
        { id: "4", name: "Deficiência" },
        { id: "5", name: "Orientação Acadêmica" },
        { id: "6", name: "Outros" },
      ];
    }
  },
};
