import { attendanceService } from "@/services/attendanceService";
import { Attendance } from "@/types/attendance";
import { formatGetAttendancesForFrontend } from "@/utils/attendanceFormUtils";
import { maskDate } from "@/utils/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAttendancesByStudent = (
  studentId: string,
  page: number = 1,
  limit: number = 1000,
) => {
  const [attendancesByStudent, setAttendances] = useState<Attendance[]>([]);
  const [isLoadingAttendancesByStudent, setIsLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setIsLoading(true);

        const data = await attendanceService.getAttendancesByStudent(
          studentId,
          page,
          limit,
        );

        setAttendances(formatGetAttendancesForFrontend(data.items) ?? []);
      } catch (error) {
        console.error("Error loading students list:", error);
        toast.error(
          `Não foi possível carregar os atendimentos do aluno ${studentId}.`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();
  }, [page, limit]);

  return {
    attendancesByStudent,
    isLoadingAttendancesByStudent,
  };
};
