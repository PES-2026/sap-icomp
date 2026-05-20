import api from "@/services/api";
import { LoginCredentials, LoginResponse } from "../types/login";

export const loginService = {
  async authenticate(data: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data, {
      fallbackMsg: "Erro ao realizar login. Verifique suas credenciais.",
    });
    return response.data;
  },
};
