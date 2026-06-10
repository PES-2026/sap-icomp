import { Request, Response } from "express";

import { CourseByIdDTO } from "../../application/dtos/course/courseByIdDto";
import { CreateCourseDTO } from "../../application/dtos/course/createCourseDto";
import { ListCourseDTO } from "../../application/dtos/course/listCourseDto";
import { RemoveCourseDTO } from "../../application/dtos/course/removeCourseDto";
import { UpdateCourseDTO } from "../../application/dtos/course/updateCourseDto";
import { CourseById } from "../../application/useCases/course/courseById";
import { CreateCourse } from "../../application/useCases/course/createCourse";
import { ListCourse } from "../../application/useCases/course/listCourse";
import { RemoveCourse } from "../../application/useCases/course/removeCourse";
import { UpdateCourse } from "../../application/useCases/course/updateCourse";

import { BaseController } from "./baseController";

export class CourseController extends BaseController {
  constructor(
    private readonly createCourseUseCase: CreateCourse,
    private readonly updateCourseUseCase: UpdateCourse,
    private readonly listCourseUseCase: ListCourse,
    private readonly courseByIdUseCase: CourseById,
    private readonly removeCourseUseCase: RemoveCourse,
  ) {
    super();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateCourseDTO.create(req.body);
      const result = await this.createCourseUseCase.execute(dto);
      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${CourseController.name}:create`);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListCourseDTO.create(req.query);
      const result = await this.listCourseUseCase.execute(dto);
      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${CourseController.name}:list`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = UpdateCourseDTO.create(req.params.id, req.body);
      const result = await this.updateCourseUseCase.execute(dto);
      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${CourseController.name}:update`);
    }
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CourseByIdDTO.create(req.params.id);
      const result = await this.courseByIdUseCase.execute(dto);
      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${CourseController.name}:findById`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveCourseDTO.create(req.params.id);
      const result = await this.removeCourseUseCase.execute(dto);
      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${CourseController.name}:remove`);
    }
  };
}
