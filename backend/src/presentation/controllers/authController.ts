import { AuthenticateUserRequestDTO } from "@application/dtos/user/authenticateUserDto";
import { AuthenticateUser } from "@application/useCases/user/authenticateUser";
import { parseExpirationToMs } from "@domain/utils/timeUtils";
import { env } from "@infrastructure/config/env";
import { Request, Response } from "express";
import { BaseController } from "./baseController";

export class AuthController extends BaseController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUser) {
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
      res.cookie("userRole", authData.role, {
        ...cookieOptions,
        httpOnly: false,
      });

      const { token: _, ...userData } = authData;

      res.status(200).json({ user: userData });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:login`);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("userRole");
      res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:logout`);
    }
  };
}
