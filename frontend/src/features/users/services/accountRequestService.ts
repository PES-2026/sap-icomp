import api from "@/services/api";

import { PendingAccountRequestItem, UserRole } from "../types/user";

export const accountRequestService = {
  async getPendingAccountRequests(): Promise<PendingAccountRequestItem[]> {
    const response = await api.get<PendingAccountRequestItem[]>(
      "/account-requests/pending",
      {
        fallbackMsg: "Não foi possível obter as solicitações pendentes.",
      },
    );

    return response.data;
  },

  async approveAccountRequest(
    id: string,
    isApproved: boolean,
    role?: UserRole,
  ): Promise<void> {
    await api.post(
      "/account-requests/approve-users",
      { id, isApproved, role },
      {
        fallbackMsg: "Não foi possível processar a solicitação.",
      },
    );
  },
};
