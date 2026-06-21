import { z } from "zod";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  passwordPatterns,
} from "./passwordRequirements";

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
      .length(8, "O número de registro deve ter exatamente 8 dígitos."),

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
      .min(PASSWORD_MIN_LENGTH, {
        message: `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.`,
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
      })
      .regex(
        passwordPatterns.uppercase,
        "Deve conter ao menos uma letra maiúscula.",
      )
      .regex(
        passwordPatterns.lowercase,
        "Deve conter ao menos uma letra minúscula.",
      )
      .regex(passwordPatterns.number, "Deve conter ao menos um número.")
      .regex(
        passwordPatterns.specialCharacter,
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
