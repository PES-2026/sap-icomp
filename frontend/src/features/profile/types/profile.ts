export type Role = "PEDAGOGOUE" | "PROFESSOR";

export interface UpdateProfilePayload {
  id: string;
  role: Role;
  name?: string;
  email?: string;
  registrationNumber?: string;
  phoneNumber?: string;
  oldPassword?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

export interface ProfileUpdateResponse {
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
}
