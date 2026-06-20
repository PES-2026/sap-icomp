import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { ApiError } from "./apiError";

declare module "axios" {
  export interface AxiosRequestConfig {
    fallbackMsg?: string;
    preserveSessionOn401?: boolean;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// mudança opcional feita para o interceptors diferenciar os diferentes erros de status
// Agora o frontend diferencia corretamente os status 40x.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined;
    const responseData = error.response?.data as
      | { message?: string; code?: string; details?: unknown }
      | undefined;

    // o status 403 representa uma autorização negada para um recurso específico e não
    // invalida a sessão. assim somente 401 (senha incorreta) limpa o usuário autenticado.
    if (status === 401 && !error.config?.preserveSessionOn401) {
      useAuthStore.getState().clearUser();
    }

    return Promise.reject(
      new ApiError(
        responseData?.message ??
          error.config?.fallbackMsg ??
          "Ocorreu um erro inesperado de comunicação.",
        status,
        responseData?.code,
        responseData?.details,
      ),
    );
  },
);

export default api;
