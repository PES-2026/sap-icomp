import api from "./api";
import {
  NewStudent,
  NewStudentFormData,
  Student,
  StudentFormData,
} from "@/types/student";

export const studentService = {
  async getStudents(): Promise<NewStudent[]> {
    const response = await api.get<NewStudent[]>("/students");
    return response.data;
  },

  //   async getStudentById(id: string): Promise<Student> {
  //     const response = await api.get<Student>(`/students/${id}`);
  //     return response.data;
  //   },

  async createStudent(data: NewStudentFormData): Promise<NewStudentFormData> {
    const response = await api.post<NewStudentFormData>("/students", data);
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
