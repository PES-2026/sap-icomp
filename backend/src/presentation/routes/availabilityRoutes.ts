import { NextFunction, Request, Response, Router } from "express";

import { CreateAvailabilityDTO } from "@application/dtos/availability/createAvailability";
import { ListAvailabilitiesByPedagogueDTO } from "@application/dtos/availability/listAvailabilitiesByPedagogue";
import { PreviewAvailabilityDTO } from "@application/dtos/availability/previewAvailability";
import { RemoveAvailabilityDTO } from "@application/dtos/availability/removeAvailability";
import { RemoveManyAvailabilitiesDTO } from "@application/dtos/availability/removeManyAvailabilities";
import { ITokenService } from "@domain/services/tokenService";
import { AvailabilityController } from "@presentation/controllers/availabilityController";
import { authMiddleware } from "@presentation/middlewares/auth";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndQuery } from "@presentation/middlewares/validateParamsAndQuery";

export const availabilityRoutes = (controller: AvailabilityController, tokenService: ITokenService) => {
  const routes = Router();

  const auth = (req: Request, res: Response, next: NextFunction) => authMiddleware(tokenService, req, res, next);

  routes.post("/availabilities/preview", auth, validateBody(PreviewAvailabilityDTO), controller.preview);
  routes.post("/availabilities", auth, validateBody(CreateAvailabilityDTO), controller.create);
  routes.get(
    "/availabilities/pedagogue/:id",
    validateParamsAndQuery(ListAvailabilitiesByPedagogueDTO),
    controller.list,
  );
  routes.put("/availabilities/:id/remove", validateParams(RemoveAvailabilityDTO), auth, controller.remove);
  routes.put("/availabilities/remove-many", validateBody(RemoveManyAvailabilitiesDTO), auth, controller.removeMany);

  return routes;
};
