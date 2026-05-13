import { Request, Response } from "express";
import { CreateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
import { CreateTypeAttendance } from "../../application/use-cases/typeAttendance/createTypeAttendance";
import { UpdateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
import { UpdateTypeAttendance } from "../../application/use-cases/typeAttendance/updateTypeAttendance";
export class TypeAttendanceController {
  constructor(
    private createTypeAttendance: CreateTypeAttendance,
    private updateTypeAttendance: UpdateTypeAttendance,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateTypeAttendanceDTO.create(req.body);
      const typeAttendance = await this.createTypeAttendance.execute(dto);
      res.status(201).json(typeAttendance);
    } catch (error) {
      this.handleError(error, res, this.create);
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto = UpdateTypeAttendanceDTO.update(req.body);
      const typeAttendance = await this.updateTypeAttendance.execute(dto);
      res.status(200).json(typeAttendance);
    } catch (error) {
      this.handleError(error, res, this.update);
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
