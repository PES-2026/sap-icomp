import { Request, Response } from "express";

import { CreateCourseDTO } from "../../application/dtos/course/createCourse.dto";
import { ListCourseDTO } from "../../application/dtos/course/listCourse.dto";
import { UpdateCourseDTO } from "../../application/dtos/course/updateCourse.dto";
import { CreateCourse } from "../../application/use-cases/course/createCourse";
import { ListCourse } from "../../application/use-cases/course/listCourse";
import { UpdateCourse } from "../../application/use-cases/course/updateCourse";
export class CourseController {
  constructor(
    private createCourse: CreateCourse,
    private updateCourse: UpdateCourse,
    private listCourse: ListCourse,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateCourseDTO.create(req.body);
      const course = await this.createCourse.execute(dto);
      res.status(201).json(course);
    } catch (error) {
      this.handleError(error, res, this.create);
    }
  }
  async list(req: Request, res: Response): Promise<void> {
    try {
      const dto = ListCourseDTO.create(req.query);
      const result = await this.listCourse.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, this.list);
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto = UpdateCourseDTO.create(req.params.id, req.body);
      const updatedCourse = await this.updateCourse.execute(dto);
      res.status(200).json(updatedCourse);
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
      message: `Internal server error to: ${CourseController.name}:${func.name}`,
    });
  }
}
