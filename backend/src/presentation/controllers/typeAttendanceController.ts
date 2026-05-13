import { Request, Response } from "express";
import { CreateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
import { CreateTypeAttendance } from "../../application/use-cases/typeAttendance/createTypeAttendance";

export class TypeAttendanceController {
  constructor(private createTypeAttendance: CreateTypeAttendance) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateTypeAttendanceDTO.create(req.body);
      const typeAttendance = await this.createTypeAttendance.execute(dto);
      res.status(201).json(typeAttendance);
    } catch (error) {
      this.handleError(error, res, this.create);
    }
  }
  handleError(error: unknown, res: Response, func: Function) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({
      message: `Internal server error to: ${TypeAttendanceController.name}:${func.name}`,
    });
  }
}
