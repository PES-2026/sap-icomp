import type { Role, UpdateProfilePayload } from "../types/profile";
import type { ProfileFormData } from "./validations";

export const buildUpdatePayloads = (
  data: ProfileFormData,
  dirtyFields: Partial<Readonly<Record<keyof ProfileFormData, boolean>>>,
  userId: string | number,
  userRole: string,
) => {
  const basicPayload: UpdateProfilePayload = {
    id: String(userId),
    role: userRole as Role,
  };
  const passwordPayload: UpdateProfilePayload = {
    id: String(userId),
    role: userRole as Role,
  };

  let hasBasicChanges = false;
  let hasPasswordChanges = false;

  if (dirtyFields.name) {
    basicPayload.name = data.name;
    hasBasicChanges = true;
  }
  if (dirtyFields.email) {
    basicPayload.email = data.email;
    hasBasicChanges = true;
  }
  if (dirtyFields.registrationNumber) {
    basicPayload.registrationNumber = data.registrationNumber;
    hasBasicChanges = true;
  }
  if (dirtyFields.phoneNumber) {
    basicPayload.phoneNumber = data.phoneNumber;
    hasBasicChanges = true;
  }

  if (dirtyFields.oldPassword) {
    passwordPayload.oldPassword = data.oldPassword;
    hasPasswordChanges = true;
  }
  if (dirtyFields.newPassword) {
    passwordPayload.newPassword = data.newPassword;
    hasPasswordChanges = true;
  }
  if (dirtyFields.newPasswordConfirmation) {
    passwordPayload.newPasswordConfirmation = data.newPasswordConfirmation;
    hasPasswordChanges = true;
  }

  return {
    basicPayload,
    passwordPayload,
    hasBasicChanges,
    hasPasswordChanges,
  };
};
