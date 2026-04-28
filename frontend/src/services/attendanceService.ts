import { Attendance } from "@/types/attendance";
import api from "./api";
import { attendanceMock } from "./mocks";

export const attendanceService = {
  async getAttendances(): Promise<Attendance[]> {
    try {
      const response = await api.get<Attendance[]>("/attendances");
      return response.data;
    } catch {
      return attendanceMock;
    }
  },
};
