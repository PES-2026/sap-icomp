import { AuthenticateUserRequestDTO } from "@application/dtos/user/authenticateUserDto";
import { AuthenticateUser } from "@application/useCases/user/authenticateUser";
import { GetAuthenticatedUser } from "@application/useCases/user/getAuthenticatedUser";
import { parseExpirationToMs } from "@domain/utils/timeUtils";
import { env } from "@infrastructure/config/env";
import { Request, Response } from "express";
import { BaseController } from "./baseController";

export class AuthController extends BaseController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUser,
    private readonly getAuthenticatedUserUseCase: GetAuthenticatedUser,
  ) {
    super();
  }

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
        secure: env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: maxAge,
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
      res.clearCookie("accessToken");
      res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:logout`);
    }
  };
}
