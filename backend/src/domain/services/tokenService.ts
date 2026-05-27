export interface ITokenService {
  generateToken(payload: string | object): string;
  verifyToken(token: string): any | null;
}
