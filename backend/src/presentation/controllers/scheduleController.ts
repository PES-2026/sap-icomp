import { Request, Response } from "express";

import { CreateSchedulePreviewDTO } from "@application/dtos/schedule/createSchedulePreviewDto";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { CreateSchedulePreviewUseCase } from "@application/useCases/schedule/createSchedulePreviewUseCase";
import { RequestSchedule } from "@application/useCases/schedule/requestSchedule";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(
    private createSchedulePreview: CreateSchedulePreviewUseCase,
    private readonly requestSchedule: RequestSchedule,
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

  request = async (req: Request, res: Response): Promise<void> => {
    const dtoResult = RequestScheduleDTO.create(req.body);
    const result = await this.requestSchedule.execute(dtoResult);

    this.handleResult(res, result);
  };
}
