import api from "@/services/api";

import {
  RegisterForm,
  RegisterPayload,
  RegisterResponse,
} from "../types/register";

export const registerService = {
  async createAccount(data: RegisterForm): Promise<RegisterResponse> {
    const payload: RegisterPayload = {
      name: data.name,
      registrationNumber: data.registrationNumber,
      phoneNumber: data.phoneNumber,
      email: data.email,
      emailConfirmation: data.confirmEmail,
      password: data.password,
      passwordConfirmation: data.confirmPassword,
    };

    const response = await api.post<RegisterResponse>("/account-requests", payload, {
      fallbackMsg: "Não foi possível criar a conta.",
    });

    return response.data;
  },
};
