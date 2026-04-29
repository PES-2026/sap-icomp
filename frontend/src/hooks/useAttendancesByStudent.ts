import { attendanceService } from "@/services/attendanceService";
import { Attendance } from "@/types/attendance";
import { maskDate } from "@/utils/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAttendancesByStudent = (
  studentId: string,
  page: number = 1,
  limit: number = 1000,
) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setIsLoading(true);
        const data = await attendanceService.getAttendancesByStudent(
          studentId,
          page,
          limit,
        );

        const attendancesData = data["items"];

        const attendancesCorrect = attendancesData.map((item: any) => {
          const { attendenceType, ...restData } = item;
          const [year, month, day] = item.attendanceDate
            .split("T")[0]
            .split("-");

          return {
            ...restData,
            attendanceType: attendenceType,
            attendanceDate: `${day}/${month}/${year}`,
          };
        });

        const attendances = attendancesCorrect as Attendance[];
        setAttendances(attendances ?? []);
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

  return { attendances, isLoading };
};
