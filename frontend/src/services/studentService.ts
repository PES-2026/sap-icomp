import api from "./api";
import { Student, StudentAttendance, StudentFormData } from "@/types/student";
import { studentAttendanceMock } from "./mocks";

export const studentService = {
  async getStudents(): Promise<Student[]> {
    const response = await api.get<Student[]>("/students");
    return response.data;
  },

  async getStudentById(id: string): Promise<StudentAttendance> {
    try {
      const response = await api.get<StudentAttendance>(`/students/${id}`);
      return response.data;
    } catch {
      return studentAttendanceMock[id];
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
