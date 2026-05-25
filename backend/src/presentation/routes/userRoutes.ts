import { Router } from "express";

import { ListUsersDTO } from "@application/dtos/user/listUsersDto";
import { UserController } from "@presentation/controllers/userController";
import { validateParams } from "@presentation/middlewares/validateParams";

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get("/users", validateParams(ListUsersDTO), controller.list);

  return router;
}
