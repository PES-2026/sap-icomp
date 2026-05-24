import { Router } from "express";

import { CreateEducatorDTO } from "@application/dtos/educator/createEducator";
import { ApproveUserDTO } from "@application/dtos/accoutnRequest/approveUserDto";
import { AccountRequestController } from "@presentation/controllers/accountRequestController";
import { validateBody } from "@presentation/middlewares/validateBody";

export function accountRequestRoutes(controller: AccountRequestController): Router {
  const router = Router();

  router.post("/account-requests", validateBody(CreateEducatorDTO), controller.create);
  router.get("/account-requests/pending", controller.listPending);
  router.post("/approve-users", validateBody(ApproveUserDTO), controller.approve);

  return router;
}
