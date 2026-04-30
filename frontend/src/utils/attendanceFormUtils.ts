import {
  Attendance,
  AttendanceFormData,
  AttendanceFormErrors,
} from "@/types/attendance";
import { formatDate } from "./utils";

export const validateAttendanceForm = (
  data: AttendanceFormData,
): AttendanceFormErrors => {
  const errs: AttendanceFormErrors = {};

  if (!data.type) errs.type = "Selecione o tipo";
  if (!data.demand) errs.demand = "A demanda é obrigatória";
  if (!data.date) errs.date = "A data é obrigátoria";

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

export const formatAttendanceForFrontend = (data: any): AttendanceFormData => {
  return {
    ...data,
    attendanceDate: formatDate(data.attendanceDate),
  };
};

export const formatGetAttendancesForFrontend = (
  data: Attendance[],
): Attendance[] => {
  return data.map((item) => {
    return {
      ...item,
      attendanceDate: formatDate(item.attendanceDate),
    };
  });
};
