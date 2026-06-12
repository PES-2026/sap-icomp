import { Request, Response } from "express";

import { PreviewAvailabilityDTO } from "@application/dtos/availability/previewAvailability";
import { PreviewAvailability } from "@application/useCases/availability/previewAvailability";

import { BaseController } from "./baseController";

export class AvailabilityController extends BaseController {
  constructor(private previewAvailability: PreviewAvailability) {
    super();
  }

  preview = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = PreviewAvailabilityDTO.create(req.body);
      const result = await this.previewAvailability.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AvailabilityController.name}:create`);
    }
  };
}
