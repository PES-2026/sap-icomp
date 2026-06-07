import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { RequestAttendance } from "@application/useCases/schedule/requestAttendance";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestAttendanceDto";

export class PublicAttendanceController extends BaseController {
  constructor(private readonly requestAttendance: RequestAttendance) {
    super();
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    const dtoResult = RequestScheduleDTO.create(req.body);

    if (dtoResult.isFailure) {
      this.clientError(res, dtoResult.error as string);
      return;
    }

    const result = await this.requestAttendance.execute(dtoResult.getValue());

    this.handleResult(res, result);
  }
}
