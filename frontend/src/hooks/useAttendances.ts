import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Attendance, AttendanceFormData } from "@/types/attendance";
import { attendanceService } from "@/services/attendanceService";
import { EMPTY_FORM_ATTENDANCE } from "@/constants/attendance";
import {
  formatAttendanceForFrontend,
  formatGetAttendancesForFrontend,
} from "@/utils/attendanceFormUtils";
import { useAppNavigation } from "@/utils/navigator";

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
  attendanceId?: string;
  isEditMode?: boolean;
}

export const useAttendanceForm = ({
  attendanceId,
  isEditMode,
}: useAttendanceFormProps) => {
  const { handleNavigation } = useAppNavigation();

  const [formData, setFormData] = useState<AttendanceFormData>(
    EMPTY_FORM_ATTENDANCE,
  );

  if (isEditMode) {
    useEffect(() => {
      const fetchAttendanceById = async () => {
        if (!attendanceId) return;

        try {
          const data = await attendanceService.getAttendancesById(attendanceId);

          if (data) {
            const formattedData = formatAttendanceForFrontend(data);
            setFormData(formattedData);
          } else {
            console.error("Attendance not found.");
            handleNavigation({ path: "/admin/students" });
          }
        } catch (error) {
          console.error("Error to fetch data attendance: ", error);
        }
      };

      fetchAttendanceById();
    }, []);
  }

  return { formData, setFormData };
};
