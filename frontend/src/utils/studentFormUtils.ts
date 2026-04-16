import { FormErrors, NewStudentFormData } from "@/types/student";

export const maskRegistration = (v: string) => v.replace(/\D/g, "").slice(0, 8);

export const maskDate = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const validateStudentForm = (data: NewStudentFormData): FormErrors => {
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

export const formatForBackend = (data: NewStudentFormData) => {
  const [day, month, year] = data.dtBirth.split("/");

  const { externalId, ...restData } = data;

  return {
    ...restData,
    dtBirth: `${year}-${month}-${day}`,
    enrollmentId: data.enrollmentId.replace(/\D/g, ""),
    phoneNumber: data.phoneNumber.replace(/\D/g, ""),
  };
};

export const formatForFrontend = (dataFromAPI: any): NewStudentFormData => {
  const [year, month, day] = dataFromAPI.dtBirth.split("T")[0].split("-");

  return {
    ...dataFromAPI,
    dtBirth: `${day}/${month}/${year}`,
    enrollmentId: maskRegistration(dataFromAPI.enrollmentId),
    phoneNumber: maskPhone(dataFromAPI.phoneNumber),
  };
};
