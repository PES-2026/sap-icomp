import { Router } from "express";
import { UserController } from "@presentation/controllers/userController";
import { validateParams } from "@presentation/middlewares/validateParams";
import { ListUsersDTO } from "@application/dtos/shared/listUsersDto";

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get("/users", validateParams(ListUsersDTO), controller.list);

  return router;
}
