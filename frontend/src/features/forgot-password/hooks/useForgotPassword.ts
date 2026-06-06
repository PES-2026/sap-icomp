"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { forgotPasswordService } from "../services/forgotPasswordService";
import { ForgotPasswordFormData, forgotPasswordSchema } from "../utils/validations";

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await forgotPasswordService.requestReset(data);
      setIsSuccess(true);
      toast.success("Se o e-mail estiver cadastrado, um link foi enviado.");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao solicitar a recuperação.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isSuccess,
    onSubmit: form.handleSubmit(onSubmit),
  };
};