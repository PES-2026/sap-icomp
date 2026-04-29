import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Attendance } from "@/types/attendance";
import { attendanceService } from "@/services/attendanceService";

export const useAttendances = (page: number, limit: number) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setIsLoading(true);
        const data = await attendanceService.getAttendances(page, limit);
        setAttendances(data ?? []);
      } catch (error) {
        console.error("Error loading students list:", error);
        toast.error("Não foi possível carregar os atendimentos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();
  }, [page, limit]);

  return { attendances, isLoading };
};
