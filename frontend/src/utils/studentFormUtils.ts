import { FormErrors, Student, StudentFormData } from "@/types/student";
import { formatDate, maskPhone, maskRegistration } from "./utils";

export const validateStudentForm = (data: StudentFormData): FormErrors => {
  const errs: FormErrors = {};

  if (!data.name.trim() || data.name.trim().length < 5)
    errs.name = "Mínimo 5 caracteres";
  if (data.enrollmentId.replace(/\D/g, "").length < 8)
    errs.enrollmentId = "Mínimo 8 dígitos";
  if (data.dtBirth.length < 10) errs.dtBirth = "Data inválida";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errs.email = "E-mail inválido";
  if (data.phoneNumber.replace(/\D/g, "").length < 10)
    errs.phoneNumber = "Telefone inválido";
  if (!data.courseId) errs.courseId = "Selecione um curso";

  return errs;
};

export const formatForBackend = (data: StudentFormData) => {
  const [day, month, year] = data.dtBirth.split("/");

  const { externalId, ...restData } = data;

  return {
    ...restData,
    dtBirth: `${year}-${month}-${day}`,
    enrollmentId: data.enrollmentId.replace(/\D/g, ""),
    phoneNumber: data.phoneNumber.replace(/\D/g, ""),
  };
};

export const formatForFrontend = (dataFromAPI: any): StudentFormData => {
  const [year, month, day] = dataFromAPI.dtBirth.split("T")[0].split("-");

  return {
    ...dataFromAPI,
    dtBirth: `${day}/${month}/${year}`,
    enrollmentId: maskRegistration(dataFromAPI.enrollmentId),
    phoneNumber: maskPhone(dataFromAPI.phoneNumber),
  };
};

export const formatGetStudentForFrontend = (data: Student): Student => {
  return {
    ...data,
    dtBirth: formatDate(data.dtBirth),
    createdAt: formatDate(data.createdAt),
    updatedAt: formatDate(data.updatedAt),
    phoneNumber: maskPhone(data.phoneNumber),
  };
};
