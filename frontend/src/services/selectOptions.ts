import { AttendanceTypesFromBackend } from "@/types/attendance";
import { CourseFromBackend } from "@/types/course";
import api from "./api";

export const coursesService = {
  async get(): Promise<CourseFromBackend[]> {
    try {
      const response = await api.get<CourseFromBackend[]>("/courses");
      return response.data;
    } catch {
      return [
        { id: "Engenharia de Software", name: "Engenharia de Software" },
        { id: "Engenharia de Computação", name: "Engenharia de Computação" },
        { id: "Ciência da Computação", name: "Ciência da Computação" },
        { id: "ABI", name: "ABI" },
        { id: "Outros", name: "Outros" },
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
