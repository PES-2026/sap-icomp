import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "Formato de e-mail inválido." })
    .trim()
    .nonempty({ message: "O e-mail é obrigatório." }),

  password: z
    .string()
    .trim()
    .nonempty({ message: "A senha é obrigatória." })
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
