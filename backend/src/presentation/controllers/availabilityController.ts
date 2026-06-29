import { Request, Response } from "express";

import { CreateAvailabilityDTO } from "@application/dtos/availability/createAvailability";
import { ListAvailabilitiesByPedagogueDTO } from "@application/dtos/availability/listAvailabilitiesByPedagogue";
import { PreviewAvailabilityDTO } from "@application/dtos/availability/previewAvailability";
import { RemoveAvailabilityDTO } from "@application/dtos/availability/removeAvailability";
import { RemoveManyAvailabilitiesDTO } from "@application/dtos/availability/removeManyAvailabilities";
import { CreateAvailability } from "@application/useCases/availability/createAvailability";
import { ListAvailabilitiesByPedagogue } from "@application/useCases/availability/listAvailabilitiesByPedagogue";
import { PreviewAvailability } from "@application/useCases/availability/previewAvailability";
import { RemoveAvailability } from "@application/useCases/availability/removeAvailability";
import { RemoveManyAvailabilities } from "@application/useCases/availability/removeManyAvailabilities";

import { BaseController } from "./baseController";

export class AvailabilityController extends BaseController {
  constructor(
    private previewAvailability: PreviewAvailability,
    private createAvailability: CreateAvailability,
    private listAvailability: ListAvailabilitiesByPedagogue,
    private removeAvailabiltiy: RemoveAvailability,
    private removeManyAvailabilities: RemoveManyAvailabilities,
  ) {
    super();
  }

  preview = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = PreviewAvailabilityDTO.create(req.body);
      const result = await this.previewAvailability.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AvailabilityController.name}:preview`);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateAvailabilityDTO.create(req.body);
      const result = await this.createAvailability.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AvailabilityController.name}:create`);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListAvailabilitiesByPedagogueDTO.create(req.params.id, req.query);
      const result = await this.listAvailability.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AvailabilityController.name}:list`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveAvailabilityDTO.create(req.params.id);
      const result = await this.removeAvailabiltiy.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AvailabilityController.name}:remove`);
    }
  };

  removeMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveManyAvailabilitiesDTO.create(req.body);
      const result = await this.removeManyAvailabilities.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AvailabilityController.name}:removeMany`);
    }
  };
}
