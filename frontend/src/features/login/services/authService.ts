import api from "@/services/api";
import { LoginResponse } from "../types/login";

export const authService = {
  async me(): Promise<LoginResponse> {
    const response = await api.get<LoginResponse>("/auth/me", {
      fallbackMsg: "Não foi possível verificar usuário.",
    });
    return response.data;
  },
};
