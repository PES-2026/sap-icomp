import { StudentFormData } from "@/types/student";
import { maskPhone, maskRegistration } from "./utils";
import { AttendanceFormData, AttendanceFormErrors } from "@/types/attendance";

export const validateAttendanceForm = (
  data: AttendanceFormData,
): AttendanceFormErrors => {
  const errs: AttendanceFormErrors = {};

  if (!data.type) errs.type = "Selecione o tipo";
  if (!data.demand) errs.demand = "A demanda é obrigatória";

  return errs;
};

export const formatAttendanceForBackend = (
  data: AttendanceFormData,
  studentId: string,
) => {
  const [day, month, year] = data.date.split("/");

  return {
    ...data,
    studentId,
    date: `${year}-${month}-${day}T00:00:00`,
  };
};

export const formatAttendanceForFrontend = (
  dataFromAPI: any,
): AttendanceFormData => {
  const [year, month, day] = dataFromAPI.attendanceDate
    .split("T")[0]
    .split("-");

  return {
    ...dataFromAPI,
    attendanceDate: `${day}/${month}/${year}`,
  };
};
