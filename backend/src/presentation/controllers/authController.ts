import { AuthenticateUserRequestDTO } from "@application/dtos/user/authenticateUserDto";
import { AuthenticateUser } from "@application/useCases/user/authenticateUser";
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
        return this.handleError(result.error, res, `${AuthController.name}:login`);
      }

      const authData = result.getValue();

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: 24 * 60 * 60 * 1000,
      };

      res.cookie("accessToken", authData.token, cookieOptions);

      const { token, ...userData } = authData;

      res.status(200).json({ user: userData });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:login`);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("accessToken");
      res.status(200).json({ message: "Logout realizado com sucesso." });
    } catch (error) {
      this.handleError(error, res, `${AuthController.name}:logout`);
    }
  };
}
