export interface VerifyTokenResult {
  valid: boolean;
  payload?: {
    id: string;
    role: string;
    email: string;
  };
}
