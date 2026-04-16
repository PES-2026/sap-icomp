import { FormErrors, StudentFormData } from "@/types/student";

export const maskRegistration = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

export const maskDate = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const maskPhone = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const validateStudentForm = (data: StudentFormData): FormErrors => {
  const errs: FormErrors = {};
  if (!data.studentName.trim()) errs.studentName = "obrigatório";
  if (!data.registration.trim() || data.registration.length < 9)
    errs.registration = "formato inválido";
  if (!data.birthDate.trim() || data.birthDate.length < 10)
    errs.birthDate = "data inválida";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errs.email = "e-mail inválido";
  if (!data.phone.trim() || data.phone.replace(/\D/g, "").length < 10)
    errs.phone = "telefone inválido";
  if (!data.course) errs.course = "selecione um curso";
  return errs;
};
