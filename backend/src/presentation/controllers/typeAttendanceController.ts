import { Request, Response } from "express";

import { CreateTypeAttendanceDTO } from "@application/dtos/typeAttendance/createTypeAttendanceDto";
import { ListTypeAttendanceDTO } from "@application/dtos/typeAttendance/listTypeAttendanceDto";
import { RemoveTypeAttendanceDTO } from "@application/dtos/typeAttendance/removeTypeAttendanceDto";
import { TypeAttendanceByIdDTO } from "@application/dtos/typeAttendance/typeAttendanceByIdDto";
import { UpdateTypeAttendanceDTO } from "@application/dtos/typeAttendance/updateTypeAttendanceDto";
import { CreateTypeAttendance } from "@application/useCases/typeAttendance/createTypeAttendance";
import { ListTypeAttendances } from "@application/useCases/typeAttendance/listTypeAttendances";
import { RemoveTypeAttendance } from "@application/useCases/typeAttendance/removeTypeAttendance";
import { TypeAttendanceById } from "@application/useCases/typeAttendance/typeAttendanceById";
import { UpdateTypeAttendance } from "@application/useCases/typeAttendance/updateTypeAttendance";

import { BaseController } from "./baseController";

export class TypeAttendanceController extends BaseController {
  constructor(
    private createTypeAttendance: CreateTypeAttendance,
    private updateTypeAttendance: UpdateTypeAttendance,
    private listTypeAttendances: ListTypeAttendances,
    private removeTypeAttendance: RemoveTypeAttendance,
    private typeAttendanceById: TypeAttendanceById,
  ) {
    super();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateTypeAttendanceDTO.create(req.body);
      const result = await this.createTypeAttendance.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${TypeAttendanceController.name}:create`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = UpdateTypeAttendanceDTO.create(req.params.id, req.body);
      const result = await this.updateTypeAttendance.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${TypeAttendanceController.name}:update`);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListTypeAttendanceDTO.create(req.query);
      const result = await this.listTypeAttendances.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${TypeAttendanceController.name}:list`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveTypeAttendanceDTO.create(req.params.id);
      const result = await this.removeTypeAttendance.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${TypeAttendanceController.name}:remove`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = TypeAttendanceByIdDTO.create(req.params.id);
      const result = await this.typeAttendanceById.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${TypeAttendanceController.name}:getById`);
    }
  };
}
