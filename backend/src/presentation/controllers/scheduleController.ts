import { Request, Response } from "express";

import { CreateScheduleDTO } from "@application/dtos/schedule/createScheduleDto";
import { CreateSchedulePreviewDTO } from "@application/dtos/schedule/createSchedulePreviewDto";
import { CreateSchedule } from "@application/useCases/schedule/createSchedule";
import { CreateSchedulePreviewUseCase } from "@application/useCases/schedule/createSchedulePreviewUseCase";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(
    private createSchedulePreview: CreateSchedulePreviewUseCase,
    private createSchedule: CreateSchedule,
  ) {
    super();
  }

  preview = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateSchedulePreviewDTO.create(req.body);
      const result = await this.createSchedulePreview.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:preview`);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateScheduleDTO.create(req.body);
      const result = await this.createSchedule.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:create`);
    }
  };
}
