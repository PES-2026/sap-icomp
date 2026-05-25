import { Request, Response } from "express";

import { ApproveUserDTO } from "@application/dtos/accountRequest/approveUserDto";
import { CreateProfessorDTO } from "@application/dtos/professor/createProfessor";
import { ApproveAccountRequest } from "@application/useCases/accountRequest/approveAccountRequest";
import { CreateAccountRequest } from "@application/useCases/accountRequest/createAccountRequest";
import { ListPendingAccountRequests } from "@application/useCases/accountRequest/listPendingAccountRequests";

import { BaseController } from "./baseController";

export class AccountRequestController extends BaseController {
  constructor(
    private readonly createAccountRequest: CreateAccountRequest,
    private readonly approveAccountRequest: ApproveAccountRequest,
    private readonly listPendingAccountRequests: ListPendingAccountRequests,
  ) {
    super();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateProfessorDTO.create(req.body);
      const result = await this.createAccountRequest.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AccountRequestController.name}:create`);
    }
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ApproveUserDTO.create(req.body);
      const result = await this.approveAccountRequest.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AccountRequestController.name}:approve`);
    }
  };

  listPending = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.listPendingAccountRequests.execute();

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AccountRequestController.name}:listPending`);
    }
  };
}
