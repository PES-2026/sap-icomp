import api from "@/services/api";
import {
  Course,
  CoursePayload,
  CoursesResponse,
  CreateCourseResponse,
  UpdateCourseResponse,
} from "../types/course";

export const coursesService = {
  async getAllCourses(page = 1, limit = 100): Promise<CoursesResponse> {
    const response = await api.get<CoursesResponse>("/courses", {
      params: { page, limit },
      fallbackMsg: "Não foi possível carregar os cursos.",
    });

    return response.data;
  },

  async getById(id: string): Promise<Course> {
    const response = await api.get<Course>(`/courses/${id}`, {
      fallbackMsg: "Não foi possível carregar os detalhes do curso.",
    });

    return response.data;
  },

  async createCourse(data: CoursePayload): Promise<CreateCourseResponse> {
    const response = await api.post<CreateCourseResponse>("/courses", data, {
      fallbackMsg: "Não foi possível criar o curso.",
    });

    return response.data;
  },

  async updateCourse(
    id: string,
    data: CoursePayload,
  ): Promise<UpdateCourseResponse> {
    const response = await api.put<UpdateCourseResponse>(
      `/courses/${id}`,
      data,
      {
        fallbackMsg: "Não foi possível atualizar o curso.",
      },
    );

    return response.data;
  },

  async removeCourse(id: string): Promise<void> {
    await api.post(`/courses/${id}/remove`, {
      fallbackMsg: "Não foi possível excluir o curso.",
    });
  },
};
