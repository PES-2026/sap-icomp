import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import { Attendance } from "../types/attendance";
import { formatGetAttendanceForFrontend } from "../utils/attendanceUtils";

interface useAttendanceByIdProps {
  attendanceId: string;
}

export const useAttendanceById = ({ attendanceId }: useAttendanceByIdProps) => {
  const [attendance, setAttendance] = useState<Attendance>();
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(true);

  const fetchAttendanceById = async () => {
    try {
      setIsLoadingAttendances(true);
      const data = await attendanceService.getAttendancesById(attendanceId);
      setAttendance(formatGetAttendanceForFrontend(data));
    } catch (error) {
      console.error("Error to fetch data attendance: ", error);
    } finally {
      setIsLoadingAttendances(false);
    }
  };

  useEffect(() => {
    fetchAttendanceById();
  }, []);

  return {
    attendance,
    isLoadingAttendances,
  };
};
