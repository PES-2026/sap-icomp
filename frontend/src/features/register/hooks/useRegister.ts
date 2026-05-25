"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { registerService } from "../services/register";
import { RegisterFormData, registerSchema } from "../utils/validations";

const EMAIL_ALREADY_REGISTERED_MESSAGE = "E-mail já cadastrado";

const isEmailAlreadyRegisteredError = (message: string) => {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("email") &&
    (normalizedMessage.includes("already registered") ||
      normalizedMessage.includes("already exists"))
  );
};

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

      toast.success("Cadastro solicitado com sucesso!");
      setRegisteredEmail(data.email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      const errorMessage = isEmailAlreadyRegisteredError(message)
        ? EMAIL_ALREADY_REGISTERED_MESSAGE
        : message;

      toast.error(errorMessage);
      setGlobalError(errorMessage);
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
