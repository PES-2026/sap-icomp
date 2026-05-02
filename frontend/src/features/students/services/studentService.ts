import api from "@/services/api";
import { Student, StudentFormData } from "../types/student";

export const studentService = {
  async getStudents(page: number = 1, limit: number = 10): Promise<Student[]> {
    const response = await api.get<Student[]>("/students", {
      params: { page, limit },
      fallbackMsg: "Não foi possível obter os alunos.",
    });
    return response.data;
  },

  async getStudentById(id: string): Promise<Student> {
    const response = await api.get<Student>(`/students/${id}`, {
      fallbackMsg: "Não foi possível obter os dados do aluno.",
    });
    return response.data;
  },

  async createStudent(data: StudentFormData): Promise<StudentFormData> {
    const response = await api.post<StudentFormData>("/student", data, {
      fallbackMsg: "Não foi possível criar o aluno.",
    });
    return response.data;
  },

  async updateStudent(
    id: string,
    data: Partial<StudentFormData>,
  ): Promise<Student> {
    const response = await api.put<Student>(`/students/${id}`, data, {
      fallbackMsg: "Não foi possível atualizar o aluno.",
    });
    return response.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/students/${id}`, {
      fallbackMsg: "Não foi possível remover o aluno.",
    });
  },
};
