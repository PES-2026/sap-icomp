import { Request, Response } from "express";

import { CancelScheduleByTokenDTO } from "@application/dtos/schedule/cancelScheduleByTokenDto";
import { CancelScheduleDTO } from "@application/dtos/schedule/cancelScheduleDto";
import { ConfirmScheduleDTO } from "@application/dtos/schedule/confirmScheduleDto";
import { CreateScheduleAvailabilityDTO } from "@application/dtos/schedule/createScheduleAvailability";
import { ListScheduleAvailabilityDTO } from "@application/dtos/schedule/listScheduleAvailabilityDto";
import { ListSchedulesDTO } from "@application/dtos/schedule/listSchedulesDto";
import { PreviewScheduleAvailabilityDTO } from "@application/dtos/schedule/previewScheduleAvailability";
import { RemoveScheduleSlotDTO } from "@application/dtos/schedule/removeScheduleSlotDto";
import { RemoveScheduleSlotsDTO } from "@application/dtos/schedule/removeScheduleSlotsDto";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { RescheduleScheduleByTokenDTO } from "@application/dtos/schedule/rescheduleScheduleByTokenDto";
import { RescheduleScheduleDTO } from "@application/dtos/schedule/rescheduleScheduleDto";
import { CancelSchedule } from "@application/useCases/schedule/cancelSchedule";
import { CancelScheduleByToken } from "@application/useCases/schedule/cancelScheduleByToken";
import { ConfirmSchedule } from "@application/useCases/schedule/confirmSchedule";
import { CreateScheduleAvailability } from "@application/useCases/schedule/createScheduleAvailability";
import { ListScheduleAvailability } from "@application/useCases/schedule/listScheduleAvailability";
import { ListSchedules } from "@application/useCases/schedule/listSchedules";
import { PreviewScheduleAvailability } from "@application/useCases/schedule/previewScheduleAvailability";
import { RemoveManyScheduleSlots } from "@application/useCases/schedule/removeManyScheduleSlots";
import { RemoveScheduleSlot } from "@application/useCases/schedule/removeScheduleSlot";
import { RequestSchedule } from "@application/useCases/schedule/requestSchedule";
import { RescheduleSchedule } from "@application/useCases/schedule/rescheduleSchedule";
import { RescheduleScheduleByToken } from "@application/useCases/schedule/rescheduleScheduleByToken";

import { BaseController } from "./baseController";

export class ScheduleController extends BaseController {
  constructor(
    private previewScheduleAvailability: PreviewScheduleAvailability,
    private createScheduleAvailability: CreateScheduleAvailability,
    private requestSchedule: RequestSchedule,
    private listScheduleAvailability: ListScheduleAvailability,
    private removeScheduleSlot: RemoveScheduleSlot,
    private removeManyScheduleSlots: RemoveManyScheduleSlots,
    private listSchedulesUseCase: ListSchedules,
    private confirmScheduleUseCase: ConfirmSchedule,
    private cancelScheduleUseCase: CancelSchedule,
    private rescheduleScheduleUseCase: RescheduleSchedule,
    private cancelScheduleByTokenUseCase: CancelScheduleByToken,
    private rescheduleScheduleByTokenUseCase: RescheduleScheduleByToken,
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
      const dto = ListScheduleAvailabilityDTO.create(req.params.id, req.query);
      const result = await this.listScheduleAvailability.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:list`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveScheduleSlotDTO.create(req.params.id);
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

  listSchedules = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListSchedulesDTO.create(req.params.id, req.query);
      const result = await this.listSchedulesUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:listSchedules`);
    }
  };

  confirm = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ConfirmScheduleDTO.create(req.params.id);
      const result = await this.confirmScheduleUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:confirm`);
    }
  };

  cancel = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CancelScheduleDTO.create(req.params.id, req.body);
      const result = await this.cancelScheduleUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:cancel`);
    }
  };

  reschedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RescheduleScheduleDTO.create(req.params.id, req.body);
      const result = await this.rescheduleScheduleUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:reschedule`);
    }
  };

  cancelByToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CancelScheduleByTokenDTO.create(req.params.token, req.body);
      const result = await this.cancelScheduleByTokenUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:cancelByToken`);
    }
  };

  rescheduleByToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RescheduleScheduleByTokenDTO.create(req.params.token, req.body);
      const result = await this.rescheduleScheduleByTokenUseCase.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ScheduleController.name}:rescheduleByToken`);
    }
  };
}
