import { Request, Response } from "express";

import { CreateCourseDTO } from "../../application/dtos/course/createCourse.dto";
import { CreateCourse } from "../../application/use-cases/course/createCourse";

export class CourseController {
  constructor(private createCourse: CreateCourse) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = CreateCourseDTO.create(req.body);
    const course = await this.createCourse.execute(dto);
  }

  handleError(error: unknown, res: Response, func: Function) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({
      message: `Internal server error to: ${CourseController.name}:${func.name}`,
    });
  }
}
