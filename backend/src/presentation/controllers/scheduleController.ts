import { Request, Response } from "express";

import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { RequestSchedule } from "@application/useCases/schedule/requestSchedule";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(private readonly requestSchedule: RequestSchedule) {
    super();
  }

  request = async (req: Request, res: Response): Promise<void> => {
    const dtoResult = RequestScheduleDTO.create(req.body);
    const result = await this.requestSchedule.execute(dtoResult);

    this.handleResult(res, result);
  };
}
