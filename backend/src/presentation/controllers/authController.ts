import { Request, Response } from "express";

import { AuthenticateUserRequestDTO } from "@application/dtos/user/authenticateUserDto";
import { AuthenticateUser } from "@application/useCases/user/authenticateUser";
import { GetAuthenticatedUser } from "@application/useCases/user/getAuthenticatedUser";
import { parseExpirationToMs } from "@domain/utils/timeUtils";
import { env } from "@infrastructure/config/env";

import { BaseController } from "./baseController";

export interface AuthControllerConfig {
  jwtExpires: string;
  isProduction: boolean;
}

export class AuthController extends BaseController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUser,
    private readonly getAuthenticatedUserUseCase: GetAuthenticatedUser,
  ) {
    super();
  }

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ForgotPasswordDTO.create(req.body);
      await this.requestPasswordResetUseCase.execute(dto);

      res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:forgotPassword`);
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ResetPasswordDTO.create(req.body);
      const result = await this.resetPasswordUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:resetPassword`);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = AuthenticateUserRequestDTO.create(req.body);

      const result = await this.authenticateUserUseCase.execute(dto);

      if (result.isFailure) {
        return this.handleResult(res, result);
      }

      const authData = result.getValue();

      const expiration = env.JWT_TOKEN_EXPIRES;
      const maxAge = parseExpirationToMs(expiration);

      const cookieOptions = {
        httpOnly: true,
        secure: env.ENVIRONMENT !== "local",
        sameSite: "lax" as const,
        maxAge: maxAge,
        domain: ".nelsul.com",
      };

      res.cookie("accessToken", authData.token, cookieOptions);

      const { token: _, ...userData } = authData;

      res.status(200).json({ user: userData });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:login`);
    }
  };

  me = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.userEmail;

      if (!email) {
        res.status(401).json({ error: "Email not found in token" });
        return;
      }

      const result = await this.getAuthenticatedUserUseCase.execute(email);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:me`);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: this.config.isProduction,
        sameSite: "lax",
        domain: ".nelsul.com",
      });

      res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:logout`);
    }
  };
}
