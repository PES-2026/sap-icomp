export type Role = "Pedagogue" | "Professor";

export type UserStatus = "Active" | "Inactive" | "Pending";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
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

export interface LoginResponse {
  user: User;
}
