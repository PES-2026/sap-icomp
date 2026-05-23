import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().nonempty({ message: "O nome é obrigatório." }),
  email: z.string().trim().email({ message: "Formato de e-mail inválido." }),
  phoneNumber: z.string().trim().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
