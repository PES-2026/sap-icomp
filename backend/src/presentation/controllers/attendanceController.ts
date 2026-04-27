import { Request, Response } from "express";
import { CreateAttendanceDTO } from "../../application/dtos/attendance/createAttendance.dto";
import { CreateAttendance } from "../../application/use-cases/attendance/createAttendance";
import { ListAttendances } from "../../application/use-cases/attendance/listAttendances";
import { ListAttendanceDTO } from "../../application/dtos/attendance/listAttendance.dto";
import { UpdateAttendanceDTO } from "../../application/dtos/attendance/updateAttedance.dto";
import { UpdateAttendance } from "../../application/use-cases/attendance/updateAttendance";
import { AttendancesByStudentDTO } from "../../application/dtos/attendance/attendancesByStudent.dto";
import { AttendancesByStudent } from "../../application/use-cases/attendance/attendanceByStudent";

export class AttendanceController {
  constructor(
    private createAttendance: CreateAttendance,
    private listAttendances: ListAttendances,
    private updateAttendance: UpdateAttendance,
    private attendancesByStudent: AttendancesByStudent,
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
      await this.updateAttendance.execute(dto);
      res.status(200).json({ message: "Attendance updated successfully!" });
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

  handleError(error: unknown, res: Response, func: Function) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({
      message: `Internal server error to: ${AttendanceController.name}:${func.name}`,
    });
  }
}
