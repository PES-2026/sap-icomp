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

export class AttendanceController {
  constructor(
    private createAttendance: CreateAttendance,
    private listAttendances: ListAttendances,
    private updateAttendance: UpdateAttendance,
    private attendancesByStudent: AttendancesByStudent,
    private removeAttendance: RemoveAttendance,
    private attendanceById: AttendanceById,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateAttendanceDTO.create(req.body);
      const attendance = await this.createAttendance.execute(dto);

      res.status(201).json(attendance);
    } catch (error) {
      this.handleError(error, res, this.create);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const dto = ListAttendanceDTO.create(req.query);
      const result = await this.listAttendances.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.list);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto = UpdateAttendanceDTO.create(req.params.id, req.body);
      const result = await this.updateAttendance.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.update);
    }
  }

  async listByStudent(req: Request, res: Response) {
    try {
      const dto = AttendancesByStudentDTO.create(req.params.id, req.query);
      const result = await this.attendancesByStudent.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.listByStudent);
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const dto = RemoveAttendanceDTO.create(req.params.id);
      await this.removeAttendance.execute(dto);
      res.status(200).json({ message: "Attendance removed successfully!" });
    } catch (error) {
      this.handleError(error, res, this.remove);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const dto = AttendanceByIdDTO.create(req.params.id);
      const result = await this.attendanceById.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.getById);
    }
  }

  handleError(error: unknown, res: Response, func: (...args: unknown[]) => unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({
      message: `Internal server error to: ${AttendanceController.name}:${func.name}`,
    });
  }
}
