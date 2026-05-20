"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginService } from "../services/login";
import { saveAuthToken } from "../utils/storage";
import { LoginFormData, loginSchema } from "../utils/validations";

export const useLogin = () => {
  const router = useRouter();
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
      saveAuthToken(response.token);

      // (Optional) Here you can dispatch the user data to the Global Context (e.g., setUser(response.user))

      router.push("/admin");
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
