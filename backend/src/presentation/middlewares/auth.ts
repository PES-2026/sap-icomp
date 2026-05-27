import { JwtTokenService } from "@infrastructure/services/jwtTokenService";
import { NextFunction, Request, Response } from "express";

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
    return res.status(401).json({ error: "Access denied. Token not provided." });
  }

  const decoded = tokenService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  req.userId = decoded.id;
  req.userRole = decoded.role;

  next();
};
