"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PATHS } from "@/constants/paths";
import { useAuthStore } from "@/store/authStore";
import { useAppNavigation } from "@/utils/navigator";
import toast from "react-hot-toast";
import { loginService } from "../services/loginService";
import { Role } from "../types/login";
import { LoginFormData, loginSchema } from "../utils/validations";

export const roleRedirects: Record<Lowercase<Role>, string> = {
  professor: PATHS.professor,
  pedagogue: PATHS.pedagogue,
};

export const useLogin = () => {
  const { handleNavigation } = useAppNavigation();

  const setUser = useAuthStore.getState().setUser;
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setGlobalError(null);

      const response = await loginService.authenticate(data);
      setUser(response.user);

      const userRole = response.user.role.toLowerCase() as Lowercase<Role>;
      const redirectPath = roleRedirects[userRole];

      if (redirectPath) {
        handleNavigation({ path: redirectPath });
      } else {
        toast.error("Perfil de usuário inválido ou não encontrado.");
      }
    } catch (error: any) {
      setGlobalError(error.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    globalError,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
