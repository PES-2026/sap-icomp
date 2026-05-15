import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { attendanceService } from "../services/attendanceService";
import { Attendance } from "../types/attendance";
import { formatGetAttendancesForFrontend } from "../utils/attendanceUtils";

export const useAttendances = (page: number, limit: number) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoadingAttendances, setIsLoadingAttendances] =
    useState<boolean>(false);

  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchAttendances = async () => {
    try {
      setIsLoadingAttendances(true);
      const data = await attendanceService.getAttendances(page, limit);
      setTotalItems(data.totalItems);
      setAttendances(formatGetAttendancesForFrontend(data.items) ?? []);
    } catch (error) {
      console.error("Error loading students list:", error);
      toast.error("Não foi possível carregar os atendimentos.");
    } finally {
      setIsLoadingAttendances(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [page, limit]);

  return { attendances, isLoadingAttendances, totalItems };
};
