import { Router } from "express";

import { ListUsersDTO } from "@application/dtos/user/listUsersDto";
import { RemoveUserDTO } from "@application/dtos/user/removeUserDto";
import { UpdateUserDTO } from "@application/dtos/user/updateUserDto";
import { UpdateUserPasswordDTO } from "@application/dtos/user/updateUserPasswordDto";
import { UserByIdDTO } from "@application/dtos/user/userByIdDto";
import { UserController } from "@presentation/controllers/userController";
import { validateParams } from "@presentation/middlewares/validateParams";

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get("/users", validateParams(ListUsersDTO), controller.list);
  router.put("/users/:id", validateParams(UpdateUserDTO), controller.update);
  router.put("/users/:id/password", validateParams(UpdateUserPasswordDTO), controller.updatePassword);
  router.get("/users/:id", validateParams(UserByIdDTO), controller.getById);
  router.post("/users/:id/remove", validateParams(RemoveUserDTO), controller.remove);

  return router;
}
