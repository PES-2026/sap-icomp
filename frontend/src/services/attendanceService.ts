import { Attendance } from "@/types/attendance";
import api from "./api";
import { attendanceMock } from "./mocks";

type PaginatedAttendancesResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Attendance[];
};

export const attendanceService = {
  async getAttendances(
    page: number = 1,
    limit: number = 10,
  ): Promise<Attendance[]> {
    try {
      const response = await api.get<PaginatedAttendancesResponse>(
        "/attendances",
        {
          params: { page, limit },
        },
      );

      return (response.data.items ?? []).map((item: any) => ({
        ...item,
        attendanceId: item.attendanceId ?? item.externalId ?? "",
        period: item.period ?? "-",
      }));
    } catch {
      const startIndex = (page - 1) * limit;
      return attendanceMock.slice(startIndex, startIndex + limit);
    }
  },
  async removeAttendance(attendanceId: string): Promise<void> {
    await api.post(`/attendances/${attendanceId}/remove`);
  },
};
