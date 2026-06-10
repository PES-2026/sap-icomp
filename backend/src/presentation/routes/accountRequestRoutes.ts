import { Router } from "express";

import { ApproveUserDTO } from "@application/dtos/accountRequest/approveUserDto";
import { CreateProfessorDTO } from "@application/dtos/professor/createProfessor";
import { AccountRequestController } from "@presentation/controllers/accountRequestController";
import { createAccountRateLimiter } from "@presentation/middlewares/rateLimiter";
import { validateBody } from "@presentation/middlewares/validateBody";

export function accountRequestRoutes(controller: AccountRequestController): Router {
  const router = Router();

  router.post("/account-requests", createAccountRateLimiter, validateBody(CreateProfessorDTO), controller.create);
  router.get("/account-requests/pending", controller.listPending);
  router.post("/account-requests/approve-users", validateBody(ApproveUserDTO), controller.approve);

  return router;
}
