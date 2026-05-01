import { api } from "@/services";
import { Student, StudentFormData } from "../types/student";

export const studentService = {
  async getStudents(page: number = 1, limit: number = 10): Promise<Student[]> {
    const response = await api.get<Student[]>("/students", {
      params: { page, limit },
    });
    return response.data;
  },

  async getStudentById(id: string): Promise<Student> {
    try {
      const response = await api.get<Student>(`/students/${id}`);
      return response.data;
    } catch {
      const response = await api.get<Student[]>("/students", {
        params: { page: 1, limit: 1000 },
      });

      const student = response.data.find(
        (item: Student) => item.externalId === id,
      );

      if (!student) {
        throw new Error(
          `Aluno com ID ${id} não encontrado na lista de fallback.`,
        );
      }

      return student;
    }
  },

  async createStudent(data: StudentFormData): Promise<StudentFormData> {
    const response = await api.post<StudentFormData>("/student", data);
    return response.data;
  },

  async updateStudent(
    id: string,
    data: Partial<StudentFormData>,
  ): Promise<Student> {
    const response = await api.put<Student>(`/students/${id}`, data);
    return response.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },
};
