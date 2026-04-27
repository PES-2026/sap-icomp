import { Request, Response } from "express";
import { CreateAttendanceDTO } from "../../application/dtos/attendance/createAttendance.dto";
import { CreateAttendance } from "../../application/use-cases/attendance/createAttendance";
import { ListAttendances } from "../../application/use-cases/attendance/listAttendances";
import { ListAttendanceDTO } from "../../application/dtos/attendance/listAttendance.dto";
import { UpdateAttendanceDTO } from "../../application/dtos/attendance/updateAttedance.dto";
import { UpdateAttendance } from "../../application/use-cases/attendance/updateAttendance";

export class AttendanceController {
  constructor(
    private createAttendance: CreateAttendance,
    private listAttendances: ListAttendances,
    private updateAttendance: UpdateAttendance,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateAttendanceDTO.create(req.body);
      const attendance = await this.createAttendance.execute(dto);

      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.status(500).json({
        message: `Internal server error to: ${AttendanceController.name}:${this.create.name}`,
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const dto = ListAttendanceDTO.create(req.query);
      const result = await this.listAttendances.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.status(500).json({
        message: `Internal server error to: ${AttendanceController.name}:${this.list.name}`,
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto = UpdateAttendanceDTO.create(req.params.id, req.body);
      await this.updateAttendance.execute(dto);
      res.status(200).json({ message: "Attendance updated successfully!" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.status(500).json({
        message: `Internal server error to: ${AttendanceController.name}:${this.update.name}`,
      });
    }
  }
}
