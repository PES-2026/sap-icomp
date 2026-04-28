import { Attendance, AttendanceFormData } from "@/types/attendance";
import api from "./api";
import { attendanceMock } from "./mocks";

export const attendanceService = {
  async getAttendances(
    page: number = 1,
    limit: number = 10,
  ): Promise<Attendance[]> {
    try {
      const response = await api.get<Attendance[]>("/attendances", {
        params: { page, limit },
      });
      return response.data;
    } catch {
      const startIndex = (page - 1) * limit;
      return attendanceMock.slice(startIndex, startIndex + limit);
    }
  },

  async getAttendancesById(id: string): Promise<Attendance> {
    try {
      const response = await api.get<Attendance>(`/attendances/${id}`);
      return response.data;
    } catch {
      const attendance = attendanceMock.find((s) => s.attendanceId === id);

      if (!attendance) {
        throw new Error(`Attendance with ID ${id} not found in mock.`);
      }

      return attendance;
    }
  },

  async create(data: AttendanceFormData): Promise<AttendanceFormData> {
    const response = await api.post<AttendanceFormData>("/attendances", data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<AttendanceFormData>,
  ): Promise<Attendance> {
    const response = await api.put<Attendance>(`/attendances/${id}`, data);
    return response.data;
  },
};
