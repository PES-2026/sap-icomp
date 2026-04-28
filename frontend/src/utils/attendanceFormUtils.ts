import { StudentFormData } from "@/types/student";
import { maskPhone, maskRegistration } from "./utils";
import { AttendanceFormData, AttendanceFormErrors } from "@/types/attendance";

export const validateAttendanceForm = (
  data: AttendanceFormData,
): AttendanceFormErrors => {
  const errs: AttendanceFormErrors = {};

  if (!data.attendanceType) errs.attendanceType = "Selecione o tipo";
  if (!data.demand) errs.demand = "A demanda é obrigatória";

  return errs;
};

export const formatAttendanceForBackend = (
  data: AttendanceFormData,
  studentId: string,
) => {
  const [day, month, year] = data.attendanceDate.split("/");

  return {
    ...data,
    studentId,
    attendanceDate: `${year}-${month}-${day}`,
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
    enrollmentId: maskRegistration(dataFromAPI.enrollmentId),
    phoneNumber: maskPhone(dataFromAPI.phoneNumber),
  };
};
