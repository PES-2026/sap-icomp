"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { loginService } from "../services/login";
import { Role } from "../types/login";
import { useAuthStore } from "../utils/storage";
import { LoginFormData, loginSchema } from "../utils/validations";

const roleRedirects: Record<Lowercase<Role>, string> = {
  professor: "/teacher",
  pedagogue: "/admin",
};

export const useLogin = () => {
  const router = useRouter();
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
        router.push(redirectPath);
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
