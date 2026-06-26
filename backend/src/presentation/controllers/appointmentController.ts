import { Request, Response } from "express";

import { AppointmentByIdDTO } from "@application/dtos/appointment/appointmentById";
import { CancelAppointmentPedagogueDTO } from "@application/dtos/appointment/cancelAppointmentPedagogue";
import { CancelAppointmentStudentDTO } from "@application/dtos/appointment/cancelAppointmentStudent";
import { ConfirmAppointmentDTO } from "@application/dtos/appointment/confirmAppointment";
import { ListAppointmentsByPedagogueDTO } from "@application/dtos/appointment/listAppointmentsByPedagogue";
import { RequestAppointmentDTO } from "@application/dtos/appointment/requestAppointment";
import { RescheduleAppointmentPedagogueDTO } from "@application/dtos/appointment/rescheduleAppointmentPedagogue";
import { RescheduleAppointmentStudentDTO } from "@application/dtos/appointment/rescheduleAppointmentStudent";
import { AppointmentById } from "@application/useCases/appointment/appointmentById";
import { CancelAppointmentPedagogue } from "@application/useCases/appointment/cancelAppointmentPedagogue";
import { CancelAppointmentStudent } from "@application/useCases/appointment/cancelAppointmentStudent";
import { ConfirmAppointment } from "@application/useCases/appointment/confirmAppointment";
import { ListAppointmentsByPedagogue } from "@application/useCases/appointment/listAppointmentsByPedagogue";
import { RequestAppointment } from "@application/useCases/appointment/requestAppointment";
import { RescheduleAppointmentPedagogue } from "@application/useCases/appointment/rescheduleAppointmentPedagogue";
import { RescheduleAppointmentStudent } from "@application/useCases/appointment/rescheduleAppointmentStudent";

import { BaseController } from "./baseController";

export class AppointmentController extends BaseController {
  constructor(
    private appointmentById: AppointmentById,
    private cancelAppointmentPedagogue: CancelAppointmentPedagogue,
    private cancelAppointmentStudent: CancelAppointmentStudent,
    private confirmAppointment: ConfirmAppointment,
    private requestAppointment: RequestAppointment,
    private listAppointmentsByPedagogue: ListAppointmentsByPedagogue,
    private rescheduleAppointmentPedagogue: RescheduleAppointmentPedagogue,
    private rescheduleAppointmentStudent: RescheduleAppointmentStudent,
  ) {
    super();
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = AppointmentByIdDTO.create(req.params.id, req.params.type);
      const result = await this.appointmentById.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:getById`);
    }
  };

  cancelPedagogue = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CancelAppointmentPedagogueDTO.create(req.params.id, req.body);
      const result = await this.cancelAppointmentPedagogue.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:cancelPedagogue`);
    }
  };

  cancelStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CancelAppointmentStudentDTO.create(req.params.token, req.body);
      const result = await this.cancelAppointmentStudent.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:cancelStudent`);
    }
  };

  confirm = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ConfirmAppointmentDTO.create(req.params.id, req.params.type);
      const result = await this.confirmAppointment.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:confirm`);
    }
  };

  listByPedagogue = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListAppointmentsByPedagogueDTO.create(req.params.id, req.query);
      const result = await this.listAppointmentsByPedagogue.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:listSchedulesByPedagogue`);
    }
  };

  request = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RequestAppointmentDTO.create(req.body);
      const result = await this.requestAppointment.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:request`);
    }
  };

  reschedulePedagogue = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RescheduleAppointmentPedagogueDTO.create(req.params.id, req.body);
      const result = await this.rescheduleAppointmentPedagogue.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:reschedulePedagogue`);
    }
  };

  rescheduleStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RescheduleAppointmentStudentDTO.create(req.params.token, req.body);
      const result = await this.rescheduleAppointmentStudent.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AppointmentController.name}:rescheduleStudent`);
    }
  };
}
