import { formatDate, maskPhone, maskRegistration } from "@/utils/utils";
import { FormErrors, Student, StudentFormData } from "../types/student";

export const EMPTY_FORM_STUDENT: StudentFormData = {
  externalId: "",
  enrollmentId: "",
  name: "",
  dtBirth: "",
  email: "",
  phoneNumber: "",
  courseId: "",
  diagnosis: "",
  potential: "",
  difficulties: "",
};

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
  return {
    ...dataFromAPI,
    dtBirth: formatDate(dataFromAPI.dtBirth),
    enrollmentId: maskRegistration(dataFromAPI.enrollmentId),
    phoneNumber: maskPhone(dataFromAPI.phoneNumber),
  };
};

export const formatGetStudentForFrontend = (data: any): Student => {
  return {
    ...data,
    course: data.courseId,
    dtBirth: formatDate(data.dtBirth),
    createdAt: formatDate(data.createdAt),
    updatedAt: formatDate(data.updatedAt),
    phoneNumber: maskPhone(data.phoneNumber),
  };
};
