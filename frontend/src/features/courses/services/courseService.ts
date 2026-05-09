import api from "@/services/api";
import { CourseFromBackend } from "../types/course";

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
