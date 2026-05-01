import { EMPTY_FORM_ATTENDANCE } from "@/constants/attendance";
import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import { AttendanceFormData } from "../types/attendance";
import { formatAttendanceForFrontend } from "../utils/attendanceUtils";

interface useAttendanceFormProps {
  attendanceId: string;
  isEditMode?: boolean;
}

export const useAttendanceForm = ({
  attendanceId,
  isEditMode,
}: useAttendanceFormProps) => {
  const [formData, setFormData] = useState<AttendanceFormData>(
    EMPTY_FORM_ATTENDANCE,
  );

  const [isLoadingAttendances, setIsLoadingAttendances] = useState(
    isEditMode ? true : false,
  );

  const fetchAttendanceById = async () => {
    try {
      setIsLoadingAttendances(true);
      const data = await attendanceService.getAttendancesById(attendanceId);
      setFormData(formatAttendanceForFrontend(data));
    } catch (error) {
      console.error("Error to fetch data attendance: ", error);
    } finally {
      setIsLoadingAttendances(false);
    }
  };

  if (isEditMode) {
    useEffect(() => {
      fetchAttendanceById();
    }, []);
  }

  return { formData, setFormData, isLoadingAttendances };
};
