export interface ITokenService {
  generateToken(payload: string | object, expiresIn?: string | number): string;
  verifyToken(token: string): any | null;
}
