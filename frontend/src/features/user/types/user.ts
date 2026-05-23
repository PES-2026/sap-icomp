export type Role = "Pedagogue" | "Professor";

export type UserStatus = "Active" | "Inactive" | "Pending";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  registrationNumber?: string;
  status: UserStatus;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
