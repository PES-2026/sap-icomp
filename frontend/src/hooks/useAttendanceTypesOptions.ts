import { useState, useEffect } from "react";
import { SelectOption } from "@/types/selectOption";
import { attendanceTypeService } from "@/services/selectOptions";
import toast from "react-hot-toast";

export const useAttendanceTypesOptions = () => {
  const [attendanceTypesOptions, setAttendanceTypesOptions] = useState<
    SelectOption[]
  >([]);

  useEffect(() => {
    const fetchAttendanceTypes = async () => {
      try {
        const response = await attendanceTypeService.get();

        const mappedOptions: SelectOption[] = response.map((course) => ({
          value: String(course.id),
          label: course.name,
        }));

        setAttendanceTypesOptions(mappedOptions);
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
