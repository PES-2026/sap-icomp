import { VerifyTokenResult } from "./results/verifyTokenResult";

export interface ITokenService {
  generateToken(payload: string | object): string;
  verifyToken(token: string): VerifyTokenResult;
}
