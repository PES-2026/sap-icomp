import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "O nome é obrigatório." })
      .transform((val) => val.replace(/\b\w/g, (char) => char.toUpperCase())),

    registrationNumber: z
      .string()
      .trim()
      .nonempty({ message: "O número de registro é obrigatório." })
      .regex(/^\d+$/, "O número de registro deve conter apenas números.")
      .min(7, "O número de registro deve ter no mínimo 7 dígitos.")
      .max(10, "O número de registro deve ter no máximo 10 dígitos."),

    phoneNumber: z
      .string()
      .trim()
      .min(1, "O telefone é obrigatório.")
      .transform((val) => val.replace(/\D/g, ""))
      .pipe(
        z
          .string()
          .length(
            11,
            "O telefone deve ter exatamente 11 dígitos (DDD + Número).",
          ),
      ),

    email: z
      .email({ message: "Formato de e-mail inválido." })
      .trim()
      .nonempty({ message: "O e-mail é obrigatório." }),

    confirmEmail: z
      .email({ message: "Formato de e-mail inválido." })
      .trim()
      .nonempty({ message: "A confirmação de e-mail é obrigatória." }),

    password: z
      .string()
      .trim()
      .nonempty({ message: "A senha é obrigatória." })
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula.")
      .regex(/[a-z]/, "Deve conter ao menos uma letra minúscula.")
      .regex(/[0-9]/, "Deve conter ao menos um número.")
      .regex(
        /[^a-zA-Z0-9]/,
        "Deve conter ao menos um caractere especial (@, #, $, etc).",
      ),

    confirmPassword: z
      .string()
      .trim()
      .nonempty({ message: "A confirmação de senha é obrigatória." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os e-mails não coincidem.",
    path: ["confirmEmail"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
