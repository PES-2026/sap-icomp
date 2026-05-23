"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { registerService } from "../services/register";
import { RegisterFormData, registerSchema } from "../utils/validations";

export const useRegister = () => {
  const { handleNavigation } = useAppNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      phoneNumber: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setGlobalError(null);

      await registerService.createAccount(data);

      toast.success("Conta criada com sucesso.");
      handleNavigation({ path: PATHS.login });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

      setGlobalError(message);
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
