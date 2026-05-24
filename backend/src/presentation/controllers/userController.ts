import { Request, Response } from "express";
import { ListUsers } from "@application/useCases/user/listUsers";
import { ListUsersDTO } from "@application/dtos/shared/listUsersDto";
import { BaseController } from "./baseController";

export class UserController extends BaseController {
  constructor(private readonly listUsersUseCase: ListUsers) {
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
}
