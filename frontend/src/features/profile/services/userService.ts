import api from "@/services/api";
import type { UpdateProfilePayload } from "../types/profile";

export const userService = {
  updateProfile: async (id: string, data: UpdateProfilePayload) => {
    const response = await api.put(`/users/${id}`, data, {
      fallbackMsg: "Não foi possível atualizar os dados do perfil.",
    });
    return response.data;
  },

  updatePassword: async (id: string, data: UpdateProfilePayload) => {
    const response = await api.put(`/users/${id}/password`, data, {
      fallbackMsg: "Não foi possível alterar a senha.",
    });
    return response.data;
  },
};
