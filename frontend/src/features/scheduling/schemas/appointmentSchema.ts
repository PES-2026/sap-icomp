import { z } from "zod";

export const appointmentSchema = z.object({
  studentName: z.string().min(1, "O nome do aluno é obrigatório"),
  email: z.email("Insira um email válido"),
  registrationNumber: z
    .string()
    .min(1, "A matrícula é obrigatória")
    .regex(/^\d+$/, "A matrícula deve conter apenas números"),
  pedagogueId: z.string().min(1, "Selecione um pedagogo"),
  date: z.string().min(1, "A data é obrigatória"),
  courseId: z.string().min(1, "Selecione um curso"),
  reason: z
    .string()
    .trim()
    .min(1, "O motivo é obrigatório")
    .max(300, "O motivo deve ter no máximo 100 caracteres"),
  slotId: z.string().min(1, "Você precisa selecionar um horário disponível"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
