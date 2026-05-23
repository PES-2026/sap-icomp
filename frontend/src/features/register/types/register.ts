import { Role, UserStatus } from "@/features/login/types/login";

export interface RegisterCredentials {
  name: string;
  registrationNumber: string;
  phoneNumber: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  status: UserStatus;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  user: RegisteredUser;
}
