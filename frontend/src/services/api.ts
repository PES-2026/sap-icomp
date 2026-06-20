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

// An optional change made to the interceptors to distinguish between different status errors
// Now the frontend correctly distinguishes between 40x statuses.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined;
    const responseData = error.response?.data as
      | { message?: string; code?: string; details?: unknown }
      | undefined;

    // A 403 status code indicates that access to a specific resource has been denied
    // and does not invalidate the session. Therefore, only a 401 (incorrect password) status
    // error logs out the authenticated user.
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
