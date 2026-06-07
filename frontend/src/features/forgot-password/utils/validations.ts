import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .email({ message: "Formato de e-mail inválido." })
    .trim()
    .nonempty({ message: "O e-mail é obrigatório." }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().nonempty({ message: "O token é obrigatório." }),
    newPassword: z
      .string()
      .trim()
      .nonempty({ message: "A nova senha é obrigatória." })
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .regex(/^[^%&=+]+$/, {
        message: "A senha contém caracteres inválidos (%, &, = ou +).",
      }),
    newPasswordConfirmation: z
      .string()
      .trim()
      .nonempty({ message: "A confirmação da senha é obrigatória." }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["newPasswordConfirmation"],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;