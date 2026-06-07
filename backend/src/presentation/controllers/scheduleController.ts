import { Request, Response } from "express";

import { CreateSchedulePreviewDTO } from "@application/dtos/schedule/createSchedulePreviewDto";
import { CreateSchedulePreviewUseCase } from "@application/useCases/schedule/createSchedulePreviewUseCase";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(private createSchedulePreview: CreateSchedulePreviewUseCase) {
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
}
