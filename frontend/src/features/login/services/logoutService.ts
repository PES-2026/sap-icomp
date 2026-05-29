import api from "@/services/api";

export const logoutService = {
  async logout(): Promise<void> {
    await api.post("/auth/logout", {
      fallbackMsg: "Não foi possível realizar o logout no servidor.",
    });
  },
};
