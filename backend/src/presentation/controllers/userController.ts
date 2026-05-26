import { Request, Response } from "express";

import { ListUsersDTO } from "@application/dtos/user/listUsersDto";
import { UpdateUserDTO } from "@application/dtos/user/updateUserDto";
import { ListUsers } from "@application/useCases/user/listUsers";
import { UpdateUser } from "@application/useCases/user/updateUser";

import { BaseController } from "./baseController";

export class UserController extends BaseController {
  constructor(
    private readonly listUsersUseCase: ListUsers,
    private readonly updateUserUseCase: UpdateUser,
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
}
