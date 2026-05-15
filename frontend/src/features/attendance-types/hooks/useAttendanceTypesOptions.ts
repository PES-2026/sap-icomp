import { SelectOption } from "@/types/selectOption";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { attendanceTypeService } from "../services/attendanceTypeService";

export const useAttendanceTypesOptions = () => {
  const [attendanceTypesOptions, setAttendanceTypesOptions] = useState<
    SelectOption[]
  >([]);

  useEffect(() => {
    const fetchAttendanceTypes = async () => {
      try {
        const response = await attendanceTypeService.getAll();

        const mappedOptions: SelectOption[] = response.items.map(
          (attendanceType) => ({
            value: String(attendanceType.id),
            label: attendanceType.name,
          }),
        );

        setAttendanceTypesOptions(mappedOptions || []);
      } catch (err) {
        console.error("Error to fetch attendance types options: ", err);
        toast.error(
          "Não foi possível carregar as opções de tipos de atendimento.",
        );
      }
    };

    fetchAttendanceTypes();
  }, []);

  return { attendanceTypesOptions };
};
