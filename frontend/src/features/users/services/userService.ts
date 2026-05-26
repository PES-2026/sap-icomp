import api from "@/services/api";

import { UserFilters, UsersResponse } from "../types/user";

export const userService = {
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters: UserFilters = {},
  ): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>("/users", {
      params: {
        page,
        limit,
        name: filters.name || undefined,
        userStatus: filters.userStatus || undefined,
      },
      fallbackMsg: "Não foi possível obter os usuários.",
    });

    return response.data;
  },
};
