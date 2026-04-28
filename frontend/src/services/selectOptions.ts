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
        { id: "Learning", name: "Aprendizado" },
        {
          id: "SocioeconomicVulnerability",
          name: "Vulnerabilidade Socioeconômica",
        },
        { id: "Emotional", name: "Emocional" },
        { id: "Deficiency", name: "Deficiência" },
        { id: "AcademicOrientation", name: "Orientação Acadêmica" },
        { id: "Others", name: "Outros" },
      ];
    }
  },
};
