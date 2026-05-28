export interface RegisterForm {
  name: string;
  registrationNumber: string;
  phoneNumber: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterPayload {
  name: string;
  registrationNumber: string;
  phoneNumber: string;
  email: string;
  emailConfirmation: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  role?: string;
  userStatus: string;
}
