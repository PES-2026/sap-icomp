import { Request, Response } from "express";

import { ListUsersDTO } from "@application/dtos/user/listUsersDto";
import { UpdateUserDTO } from "@application/dtos/user/updateUserDto";
import { UpdateUserPasswordDTO } from "@application/dtos/user/updateUserPasswordDto";
import { UserByIdDTO } from "@application/dtos/user/userByIdDto";
import { ListUsers } from "@application/useCases/user/listUsers";
import { UpdateUser } from "@application/useCases/user/updateUser";
import { UpdateUserPassword } from "@application/useCases/user/updateUserPassword";
import { GetUserById } from "@application/useCases/user/getUserById";

import { BaseController } from "./baseController";

export class UserController extends BaseController {
  constructor(
    private readonly listUsersUseCase: ListUsers,
    private readonly updateUserUseCase: UpdateUser,
    private readonly updateUserPasswordUseCase: UpdateUserPassword,
    private readonly getUserByIdUseCase: GetUserById,
  ) {
    super();
  }

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListUsersDTO.create(req.query);
      const result = await this.listUsersUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${UserController.name}:list`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.dto as UpdateUserDTO;
      const result = await this.updateUserUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${UserController.name}:update`);
    }
  };

  updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.dto as UpdateUserPasswordDTO;
      const result = await this.updateUserPasswordUseCase.execute(dto);

      this.handleResult(res, result, 200);
    } catch (error) {
      this.handleError(error, res, `${UserController.name}:updatePassword`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.dto as UserByIdDTO;
      const result = await this.getUserByIdUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${UserController.name}:getById`);
    }
  };
}
