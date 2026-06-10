import api from "@/services/api";

import { getMockUsersResponse } from "../hooks/useUsersMock";
import { UserFilters, UsersResponse } from "../types/user";

const shouldUseMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const userService = {
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters: UserFilters = {},
  ): Promise<UsersResponse> {
    if (shouldUseMocks) {
      return getMockUsersResponse(page, limit, filters);
    }

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

  async remove(id: string): Promise<void> {
    await api.post(`/users/${id}/remove`, {
      fallbackMsg: "Não foi possível remover o usuário.",
    });
  },
};
