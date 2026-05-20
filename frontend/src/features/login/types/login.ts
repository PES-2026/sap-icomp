export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Pedagogue" | "Teacher" | "Student";
  status: "Active" | "Inactive" | "Pending";
}

export interface LoginResponse {
  token: string;
  user: User;
}
