import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().nonempty({ message: "O nome é obrigatório." }),

    registrationNumber: z
      .string()
      .trim()
      .nonempty({ message: "O número de registro é obrigatório." }),

    phoneNumber: z
      .string()
      .trim()
      .nonempty({ message: "O telefone é obrigatório." }),

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
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),

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
