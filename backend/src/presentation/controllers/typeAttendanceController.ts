import { Request, Response } from "express";
import { CreateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
import { CreateTypeAttendance } from "../../application/use-cases/typeAttendance/createTypeAttendance";
import { UpdateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
import { UpdateTypeAttendance } from "../../application/use-cases/typeAttendance/updateTypeAttendance";
import { ListTypeAttendanceDTO } from "../../application/dtos/typeAttendance/listTypeAttendance.dto";
import { ListTypeAttendance } from "../../application/use-cases/typeAttendance/listTypeAttendances";
import { TypeAttendanceById } from "../../application/use-cases/typeAttendance/typeAttendanceById";
import { RemoveTypeAttendance } from "../../application/use-cases/typeAttendance/removeTypeAttendance";
import { RemoveTypeAttendanceDTO } from "../../application/dtos/typeAttendance/removeTypeAttendance.dto";
import { TypeAttendanceByIdDTO } from "../../application/dtos/typeAttendance/typeAttendanceById.dto";

export class TypeAttendanceController {
  constructor(
    private createTypeAttendance: CreateTypeAttendance,
    private updateTypeAttendance: UpdateTypeAttendance,
    private listTypeAttendances: ListTypeAttendance,
    private typeAttendanceById: TypeAttendanceById,
    private removeTypeAttendance: RemoveTypeAttendance,
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
  async list(req: Request, res: Response): Promise<void> {
    try {
      const dto = ListTypeAttendanceDTO.create(req.query);
      const result = await this.listTypeAttendances.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.list);
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const externalId = TypeAttendanceByIdDTO.create(req.params.id);
      const result = await this.typeAttendanceById.execute(externalId);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.getById);
    }
  }
  async remove(req: Request, res: Response): Promise<void> {
    try {
      const dto = RemoveTypeAttendanceDTO.create(req.params.id);
      await this.removeTypeAttendance.execute(dto);
      res.status(200).json({ message: "TypeAttendance removed successfully!" });
    } catch (error) {
      this.handleError(error, res, this.remove);
    }
  }
}
