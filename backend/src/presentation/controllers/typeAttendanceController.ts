import {Request, Response} from "express";
import {CreateTypeAttendanceDTO} from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
import {CreateTypeAttendance} from "../../application/use-cases/typeAttendance/createTypeAttendance.ts";

export class TypeAttendanceController {
  constructor(
    private createTypeAttendance: CreateTypeAttendance,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateTypeAttendanceDTO.create(req.body);
      const typeAttendance = await this.createTypeAttendance.execute(dto);
