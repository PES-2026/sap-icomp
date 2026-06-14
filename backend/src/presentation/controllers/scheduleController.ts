import { Request, Response } from "express";

import { CreateScheduleAvailabilityDTO } from "@application/dtos/schedule/createScheduleAvailability";
import { PreviewScheduleAvailabilityDTO } from "@application/dtos/schedule/previewScheduleAvailability";
import { CreateScheduleAvailability } from "@application/useCases/schedule/createScheduleAvailability";
import { PreviewScheduleAvailability } from "@application/useCases/schedule/previewScheduleAvailability";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(
    private previewScheduleAvailability: PreviewScheduleAvailability,
    private createScheduleAvailability: CreateScheduleAvailability,
  ) {
    super();
  }

  preview = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = PreviewScheduleAvailabilityDTO.create(req.body);
      const result = await this.previewScheduleAvailability.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:preview`);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateScheduleAvailabilityDTO.create(req.body);
      const result = await this.createScheduleAvailability.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:create`);
    }
  };
}
