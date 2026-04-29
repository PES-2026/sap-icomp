import { Attendance } from "@/types/attendance";
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
};
