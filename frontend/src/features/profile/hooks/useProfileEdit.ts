"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/authStore";
import { maskPhone } from "@/utils/utils";
import { userService } from "../services/userService";
import { ProfileUpdateResponse } from "../types/profile";
import { buildUpdatePayloads } from "../utils/profileHelpers";
import { profileSchema, type ProfileFormData } from "../utils/validations";

export const useProfileEdit = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

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

  const { reset } = form;

  const resetForm = useCallback(() => {
    if (!user) return;

    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      registrationNumber: user.registrationNumber ?? "",
      phoneNumber: user.phoneNumber ? maskPhone(user.phoneNumber) : "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    });
  }, [user, reset]);

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
        let updatedProfileData: ProfileUpdateResponse | undefined;

        if (hasBasicChanges && hasPasswordChanges) {
          const [profileRes] = await Promise.all([
            userService.updateProfile(basicPayload.id, basicPayload),
            userService.updatePassword(passwordPayload.id, passwordPayload),
          ]);
          updatedProfileData = profileRes;
        } else if (hasBasicChanges) {
          updatedProfileData = await userService.updateProfile(
            basicPayload.id,
            basicPayload,
          );
        } else if (hasPasswordChanges) {
          await userService.updatePassword(passwordPayload.id, passwordPayload);
        }

        toast.success("Perfil atualizado com sucesso!");

        if (hasBasicChanges && updatedProfileData) {
          setUser({
            ...user,
            name: updatedProfileData.name,
            email: updatedProfileData.email,
            phoneNumber: updatedProfileData.phoneNumber,
            registrationNumber: updatedProfileData.registrationNumber,
          });
        }

        reset({
          name: updatedProfileData?.name ?? data.name,
          email: updatedProfileData?.email ?? data.email,
          registrationNumber:
            updatedProfileData?.registrationNumber ?? data.registrationNumber,
          phoneNumber: updatedProfileData?.phoneNumber
            ? maskPhone(updatedProfileData.phoneNumber)
            : data.phoneNumber,
          oldPassword: "",
          newPassword: "",
          newPasswordConfirmation: "",
        });
      } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [form.formState.dirtyFields, user, setUser, reset],
  );

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    resetForm,
  };
};
