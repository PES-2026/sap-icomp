import { z } from "zod";

export const profileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "O nome é obrigatório." })
      .transform((val) => val.replace(/\b\w/g, (char) => char.toUpperCase())),
    registrationNumber: z
      .string()
      .trim()
      .nonempty({ message: "O número de registro é obrigatório." }),
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

    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    newPasswordConfirmation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const oldPwd = data.oldPassword?.trim() || "";
    const newPwd = data.newPassword?.trim() || "";
    const confirmPwd = data.newPasswordConfirmation?.trim() || "";

    const isChangingPassword =
      oldPwd !== "" || newPwd !== "" || confirmPwd !== "";

    if (isChangingPassword) {
      if (oldPwd === "") {
        ctx.addIssue({
          path: ["oldPassword"],
          code: "custom",
          message: "A senha atual é obrigatória para alterar a senha.",
        });
      }

      if (newPwd === "") {
        ctx.addIssue({
          path: ["newPassword"],
          code: "custom",
          message: "A nova senha é obrigatória.",
        });
      } else {
        if (newPwd.length < 8) {
          ctx.addIssue({
            path: ["newPassword"],
            code: "custom",
            message: "A senha deve ter no mínimo 8 caracteres.",
          });
        }
        if (!/[A-Z]/.test(newPwd)) {
          ctx.addIssue({
            path: ["newPassword"],
            code: "custom",
            message: "Deve conter ao menos uma letra maiúscula.",
          });
        }
        if (!/[a-z]/.test(newPwd)) {
          ctx.addIssue({
            path: ["newPassword"],
            code: "custom",
            message: "Deve conter ao menos uma letra minúscula.",
          });
        }
        if (!/[0-9]/.test(newPwd)) {
          ctx.addIssue({
            path: ["newPassword"],
            code: "custom",
            message: "Deve conter ao menos um número.",
          });
        }
        if (!/[^a-zA-Z0-9]/.test(newPwd)) {
          ctx.addIssue({
            path: ["newPassword"],
            code: "custom",
            message:
              "Deve conter ao menos um caractere especial (@, #, $, etc).",
          });
        }
      }

      if (confirmPwd === "") {
        ctx.addIssue({
          path: ["newPasswordConfirmation"],
          code: "custom",
          message: "A confirmação de senha é obrigatória.",
        });
      } else if (newPwd !== "" && newPwd !== confirmPwd) {
        ctx.addIssue({
          path: ["newPasswordConfirmation"],
          code: "custom",
          message: "As senhas não coincidem.",
        });
      }

      if (oldPwd !== "" && newPwd !== "" && oldPwd === newPwd) {
        ctx.addIssue({
          path: ["newPassword"],
          code: "custom",
          message: "A nova senha não pode ser igual à senha atual.",
        });
      }
    }
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
