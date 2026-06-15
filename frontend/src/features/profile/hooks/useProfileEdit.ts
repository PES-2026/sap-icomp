"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import { maskPhone } from "@/utils/utils";
import toast from "react-hot-toast";
import { userService } from "../services/userService";
import { buildUpdatePayloads } from "../utils/profileHelpers";
import { profileSchema, type ProfileFormData } from "../utils/validations";

export const useProfileEdit = () => {
  const user = useAuthStore((s) => s.user);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      registrationNumber: user?.registrationNumber ?? "",
      phoneNumber: user?.phoneNumber ? maskPhone(user.phoneNumber) : "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const resetForm = useCallback(() => {
    if (!user) return;

    form.reset({
      name: user.name ?? "",
      email: user.email ?? "",
      registrationNumber: user.registrationNumber ?? "",
      phoneNumber: user.phoneNumber ? maskPhone(user.phoneNumber) : "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    });
  }, [user, form]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const submit = useCallback(
    async (data: ProfileFormData) => {
      if (!user?.id || !user?.role) return;

      const {
        basicPayload,
        passwordPayload,
        hasBasicChanges,
        hasPasswordChanges,
      } = buildUpdatePayloads(
        data,
        form.formState.dirtyFields,
        user.id,
        user.role,
      );

      if (!hasBasicChanges && !hasPasswordChanges) return;

      try {
        const promises = [];

        if (hasBasicChanges) {
          promises.push(
            userService.updateProfile(basicPayload.id, basicPayload),
          );
        }

        if (hasPasswordChanges) {
          promises.push(
            userService.updatePassword(passwordPayload.id, passwordPayload),
          );
        }

        await Promise.all(promises);

        form.reset({
          ...data,
          oldPassword: "",
          newPassword: "",
          newPasswordConfirmation: "",
        });
      } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [form, user],
  );

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    resetForm,
  };
};
