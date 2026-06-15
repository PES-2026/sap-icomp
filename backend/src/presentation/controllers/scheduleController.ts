import { Request, Response } from "express";

import { CreateScheduleAvailabilityDTO } from "@application/dtos/schedule/createScheduleAvailability";
import { ListScheduleAvailabilityDTO } from "@application/dtos/schedule/listScheduleAvailabilityDto";
import { PreviewScheduleAvailabilityDTO } from "@application/dtos/schedule/previewScheduleAvailability";
import { RemoveScheduleSlotDTO } from "@application/dtos/schedule/removeScheduleSlotDto";
import { RemoveScheduleSlotsDTO } from "@application/dtos/schedule/removeScheduleSlotsDto";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { CreateScheduleAvailability } from "@application/useCases/schedule/createScheduleAvailability";
import { ListScheduleAvailability } from "@application/useCases/schedule/listScheduleAvailability";
import { PreviewScheduleAvailability } from "@application/useCases/schedule/previewScheduleAvailability";
import { RemoveManyScheduleSlots } from "@application/useCases/schedule/removeManyScheduleSlots";
import { RemoveScheduleSlot } from "@application/useCases/schedule/removeScheduleSlot";
import { RequestSchedule } from "@application/useCases/schedule/requestSchedule";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(
    private previewScheduleAvailability: PreviewScheduleAvailability,
    private createScheduleAvailability: CreateScheduleAvailability,
    private requestSchedule: RequestSchedule,
    private listScheduleAvailability: ListScheduleAvailability,
    private removeScheduleSlot: RemoveScheduleSlot,
    private removeManyScheduleSlots: RemoveManyScheduleSlots,
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

  request = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RequestScheduleDTO.create(req.body);
      const result = await this.requestSchedule.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:request`);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const pedagogueId = req.userId;
      const dto = ListScheduleAvailabilityDTO.create(req.query, pedagogueId);
      const result = await this.listScheduleAvailability.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:list`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveScheduleSlotDTO.create(req.params);
      const result = await this.removeScheduleSlot.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:remove`);
    }
  };

  removeMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveScheduleSlotsDTO.create(req.body);
      const result = await this.removeManyScheduleSlots.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:removeMany`);
    }
  };
}
