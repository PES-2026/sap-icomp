import { JwtTokenService } from "@infrastructure/services/jwtTokenService";
import { NextFunction, Request, Response } from "express";

// Ajuste na tipagem do Express (Isso pode ir para presentation/@types/express.d.ts)
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tokenService = new JwtTokenService();

  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
  }

  const decoded = tokenService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }

  req.userId = decoded.id;
  req.userRole = decoded.role;

  next();
};
