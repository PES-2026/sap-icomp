import { useAuthStore } from "@/features/login/utils/storage";
import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    fallbackMsg?: string;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      useAuthStore.getState().clearUser;
      return Promise.reject(error);
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    if (error.config?.fallbackMsg) {
      return Promise.reject(new Error(error.config.fallbackMsg));
    }

    return Promise.reject(
      new Error("Ocorreu um erro inesperado de comunicação."),
    );
  },
);

export default api;
