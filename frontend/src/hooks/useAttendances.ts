import { EMPTY_FORM_ATTENDANCE } from "@/constants/attendance";
import { attendanceService } from "@/services/attendanceService";
import { Attendance, AttendanceFormData } from "@/types/attendance";
import {
  formatAttendanceForFrontend,
  formatGetAttendancesForFrontend,
} from "@/utils/attendanceFormUtils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAttendances = (page: number, limit: number) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoadingAttendances, setIsLoadingAttendances] =
    useState<boolean>(false);

  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
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

    fetchAttendances();
  }, [page, limit]);

  return { attendances, isLoadingAttendances, totalItems };
};

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

  if (isEditMode) {
    useEffect(() => {
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

      fetchAttendanceById();
    }, []);
  }

  return { formData, setFormData, isLoadingAttendances };
};
