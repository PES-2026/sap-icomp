import { NextFunction, Request, Response } from "express";

import { ITokenService } from "@domain/services/tokenService";

export const authMiddleware = (jwtService: ITokenService, req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token not provided." });
  }

  const decoded = jwtService.verifyToken(token);

  if (!decoded || typeof decoded === "string" || !decoded.payload || decoded.valid === false) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  if (!decoded.payload?.id || !decoded.payload?.role || !decoded.payload?.email) {
    return res.status(401).json({ error: "Invalid token payload." });
  }

  req.userId = decoded.payload.id;
  req.userRole = decoded.payload.role;
  req.userEmail = decoded.payload.email;

  next();
};
