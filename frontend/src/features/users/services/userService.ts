import api from "@/services/api";

import { UsersResponse } from "../types/user";

export const userService = {
  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>("/users", {
      params: { page, limit },
      fallbackMsg: "Não foi possível obter os usuários.",
    });

    return response.data;
  },
};
