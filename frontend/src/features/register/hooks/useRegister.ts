"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerService } from "../services/register";
import { RegisterFormData, registerSchema } from "../utils/validations";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
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

      setRegisteredEmail(data.email);
      setIsSubmitted(true);
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
    isSubmitted,
    registeredEmail,
    globalError,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
