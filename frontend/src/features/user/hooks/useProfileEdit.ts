"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/features/login/utils/storage";
import { userService } from "../services/userService";
import { profileSchema, type ProfileFormData } from "../utils/validations";

export const useProfileEdit = () => {
  const user = useAuthStore((s) => s.user);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const submit = useCallback(async (data: ProfileFormData) => {
    await userService.updateProfile(data);
  }, []);

  return {
    form,
    onSubmit: form.handleSubmit(submit),
  };
};
