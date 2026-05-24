import { Request, Response } from "express";

import { CreateEducatorDTO } from "@application/dtos/educator/createEducator";
import { ApproveUserDTO } from "@application/dtos/accoutnRequest/approveUserDto";
import { CreateAccountRequest } from "@application/useCases/accountRequest/createAccountRequest";
import { ApproveAccountRequest } from "@application/useCases/accountRequest/approveAccountRequest";
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
      const dto = CreateEducatorDTO.create(req.body);
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
