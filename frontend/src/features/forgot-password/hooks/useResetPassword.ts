"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { forgotPasswordService } from "../services/forgotPasswordService";
import { ResetPasswordFormData, resetPasswordSchema } from "../utils/validations";

export const useResetPassword = () => {
  const { handleNavigation } = useAppNavigation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      await forgotPasswordService.resetPassword(data);
      toast.success("Senha redefinida com sucesso!");
      handleNavigation({ path: PATHS.login });
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao redefinir a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    hasToken: !!token,
    onSubmit: form.handleSubmit(onSubmit),
  };
};