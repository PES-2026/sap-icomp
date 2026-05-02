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
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.error));
    }

    if (error.config?.fallbackMsg) {
      return Promise.reject(new Error(error.config.fallbackMsg));
    }

    return Promise.reject(
      new Error("Ocorreu um erro inesperado de comunicação."),
    );
  },
);

// api.interceptors.request.use((config) => {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
