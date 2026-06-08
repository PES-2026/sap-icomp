export interface IEmailService {
  sendPasswordResetEmail(to: string, name: string, token: string): Promise<void>;
}
