import api from "@/services/api";
import { ForgotPasswordData, ResetPasswordData } from "../types";

export const forgotPasswordService = {
  async requestReset(data: ForgotPasswordData): Promise<void> {
    await api.post("/auth/forgot-password", data, {
      fallbackMsg: "Não foi possível solicitar a recuperação de senha.",
    });
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post("/auth/reset-password", data, {
      fallbackMsg: "Não foi possível redefinir a senha.",
    });
  },
};