export type UserRole = "PEDAGOGUE" | "PROFESSOR" | string;

export type UserStatus =
  | "ENABLED"
  | "DISABLED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | string;

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  role: UserRole;
  userStatus: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: UserListItem[];
}
