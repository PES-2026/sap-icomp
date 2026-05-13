import { Request, Response } from "express";

import { AttendanceByIdDTO } from "@application/dtos/attendance/attendanceByIdDto";
import { AttendancesByStudentDTO } from "@application/dtos/attendance/attendancesByStudentDto";
import { CreateAttendanceDTO } from "@application/dtos/attendance/createAttendanceDto";
import { ListAttendanceDTO } from "@application/dtos/attendance/listAttendanceDto";
import { RemoveAttendanceDTO } from "@application/dtos/attendance/removeAttendanceDto";
import { UpdateAttendanceDTO } from "@application/dtos/attendance/updateAttendanceDto";
import { AttendanceById } from "@application/useCases/attendance/attendanceById";
import { AttendancesByStudent } from "@application/useCases/attendance/attendanceByStudent";
import { CreateAttendance } from "@application/useCases/attendance/createAttendance";
import { ListAttendances } from "@application/useCases/attendance/listAttendances";
import { RemoveAttendance } from "@application/useCases/attendance/removeAttendance";
import { UpdateAttendance } from "@application/useCases/attendance/updateAttendance";

import { BaseController } from "./baseController";

export class AttendanceController extends BaseController {
  constructor(
    private createAttendance: CreateAttendance,
    private listAttendances: ListAttendances,
    private updateAttendance: UpdateAttendance,
    private attendancesByStudent: AttendancesByStudent,
    private removeAttendance: RemoveAttendance,
    private attendanceById: AttendanceById,
  ) {
    super();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateAttendanceDTO.create(req.body);
      const result = await this.createAttendance.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${AttendanceController.name}:create`);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListAttendanceDTO.create(req.query);
      const result = await this.listAttendances.execute(dto);
      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceController.name}:list`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = UpdateAttendanceDTO.create(req.params.id, req.body);
      const result = await this.updateAttendance.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceController.name}:update`);
    }
  };

  listByStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = AttendancesByStudentDTO.create(req.params.id, req.query);
      const result = await this.attendancesByStudent.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceController.name}:listByStudent`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveAttendanceDTO.create(req.params.id);
      const result = await this.removeAttendance.execute(dto);

      if (result.isFailure) {
        return this.handleResult(res, result);
      }
      this.ok(res, { message: "Attendance removed successfully!" });
    } catch (error) {
      this.handleError(error, res, `${AttendanceController.name}:remove`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = AttendanceByIdDTO.create(req.params.id);
      const result = await this.attendanceById.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${AttendanceController.name}:getById`);
    }
  };
}
