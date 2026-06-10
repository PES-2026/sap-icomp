import { Router } from "express";

import { ListUsersDTO } from "@application/dtos/user/listUsersDto";
import { RemoveUserDTO } from "@application/dtos/user/removeUserDto";
import { UpdateUserDTO } from "@application/dtos/user/updateUserDto";
import { UpdateUserPasswordDTO } from "@application/dtos/user/updateUserPasswordDto";
import { UserByIdDTO } from "@application/dtos/user/userByIdDto";
import { UserController } from "@presentation/controllers/userController";
import { authRateLimiter } from "@presentation/middlewares/rateLimiter";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndBody } from "@presentation/middlewares/validateParamsAndBody";
import { validateQuery } from "@presentation/middlewares/validateQuery";

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get("/users", validateQuery(ListUsersDTO), controller.list);
  router.put("/users/:id", validateParamsAndBody(UpdateUserDTO), controller.update);
  router.put(
    "/users/:id/password",
    authRateLimiter,
    validateParamsAndBody(UpdateUserPasswordDTO),
    controller.updatePassword,
  );
  router.get("/users/:id", validateParams(UserByIdDTO), controller.getById);
  router.post("/users/:id/remove", validateParams(RemoveUserDTO), controller.remove);

  return router;
}
