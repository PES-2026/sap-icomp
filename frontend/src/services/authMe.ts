import { LoginResponse } from "@/features/login/types/login";
import api from "@/services/api";

export const authMeService = {
  async me(): Promise<LoginResponse> {
    const response = await api.get<LoginResponse>("/auth/me", {
      fallbackMsg: "Não foi possível realizar a autenticação.",
    });
    return response.data;
  },
};
