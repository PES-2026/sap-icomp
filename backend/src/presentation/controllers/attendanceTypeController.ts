import { Request, Response } from "express";

import { AttendanceTypeByIdDTO } from "@application/dtos/attendanceType/attendanceTypeByIdDto";
import { CreateAttendanceTypeDTO } from "@application/dtos/attendanceType/createAttendanceTypeDto";
import { ListAttendanceTypeDTO } from "@application/dtos/attendanceType/listAttendanceTypeDto";
import { RemoveAttendanceTypeDTO } from "@application/dtos/attendanceType/removeAttendanceTypeDto";
import { UpdateAttendanceTypeDTO } from "@application/dtos/attendanceType/updateAttendanceTypeDto";
import { AttendanceTypeById } from "@application/useCases/attendanceType/attendanceTypeById";
import { CreateAttendanceType } from "@application/useCases/attendanceType/createAttendanceType";
import { ListAttendanceTypes } from "@application/useCases/attendanceType/listAttendanceType";
import { RemoveAttendanceType } from "@application/useCases/attendanceType/removeAttendanceType";
import { UpdateAttendanceType } from "@application/useCases/attendanceType/updateAttendanceType";

import { BaseController } from "./baseController";

export class AttendanceTypeController extends BaseController {
  constructor(
    private createAttendanceType: CreateAttendanceType,
    private updateAttendanceType: UpdateAttendanceType,
    private listAttendanceTypes: ListAttendanceTypes,
    private removeAttendanceType: RemoveAttendanceType,
    private attendanceTypeById: AttendanceTypeById,
  ) {
    super();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateAttendanceTypeDTO.create(req.body);
      const result = await this.createAttendanceType.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AttendanceTypeController.name}:create`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = UpdateAttendanceTypeDTO.create(req.params.id, req.body);
      const result = await this.updateAttendanceType.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceTypeController.name}:update`);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListAttendanceTypeDTO.create(req.query);
      const result = await this.listAttendanceTypes.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceTypeController.name}:list`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveAttendanceTypeDTO.create(req.params.id);
      const result = await this.removeAttendanceType.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceTypeController.name}:remove`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = AttendanceTypeByIdDTO.create(req.params.id);
      const result = await this.attendanceTypeById.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceTypeController.name}:getById`);
    }
  };
}
