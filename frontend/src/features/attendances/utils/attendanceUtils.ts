import { formatDate } from "@/utils/utils";
import {
  Attendance,
  AttendanceFormData,
  AttendanceFormErrors,
} from "../types/attendance";

export const EMPTY_FORM_ATTENDANCE: AttendanceFormData = {
  studentId: "",
  date: "",
  type: "",
  demand: "",
  generalObservations: "",
};

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
    date: formatDate(data.date),
  };
};

export const formatGetAttendancesForFrontend = (data: any[]): Attendance[] => {
  return data.map((item) => {
    const { id, attendanceDate, ...rest } = item;

    return {
      ...rest,
      attendanceId: id,
      attendanceDate: formatDate(item.attendanceDate),
    };
  });
};
