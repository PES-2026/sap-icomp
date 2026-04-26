import { Request, Response } from "express";
import { CreateAttendanceDTO } from "../../application/dtos/attendance/createAttendance.dto";
import { CreateAttendance } from "../../application/use-cases/attendance/createAttendance";

export class AttendanceController {
  constructor(private createAttendance: CreateAttendance) {}

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
}
