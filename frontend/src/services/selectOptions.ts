import { AttendanceTypesFromBackend } from "@/types/attendance";
import api from "./api";
import { CourseFromBackend } from "@/types/course";

export const coursesService = {
  async get(): Promise<CourseFromBackend[]> {
    try {
      const response = await api.get<CourseFromBackend[]>("/courses");
      return response.data;
    } catch {
      return [
        { id: "1", name: "Engenharia de Software" },
        { id: "2", name: "Engenharia de Computação" },
        { id: "3", name: "Ciência da Computação" },
        { id: "4", name: "ABI" },
        { id: "5", name: "Outros" },
      ];
    }
  },
};

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
