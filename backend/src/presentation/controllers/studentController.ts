import { Request, Response } from "express";

import { CreateStudentDTO } from "@application/dtos/student/createStudentDto";
import { ListStudentDTO } from "@application/dtos/student/listStudentsDto";
import { RemoveStudentDTO } from "@application/dtos/student/removeStudentDto";
import { StudentByIdDTO } from "@application/dtos/student/studentByIdDto";
import { UpdateStudentDTO } from "@application/dtos/student/updateStudentDto";
import { CreateStudent } from "@application/useCases/student/createStudent";
import { ListStudents } from "@application/useCases/student/listStudents";
import { RemoveStudent } from "@application/useCases/student/removeStudent";
import { StudentById } from "@application/useCases/student/studentById";
import { UpdateStudent } from "@application/useCases/student/updateStudent";

import { BaseController } from "./baseController";

export class StudentController extends BaseController {
  constructor(
    private readonly createStudent: CreateStudent,
    private readonly listStudents: ListStudents,
    private readonly updateStudent: UpdateStudent,
    private readonly studentById: StudentById,
    private readonly removeStudent: RemoveStudent,
  ) {
    super();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateStudentDTO.create(req.body);
      const result = await this.createStudent.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${StudentController.name}:create`);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const dto = ListStudentDTO.create(req.query);
      const result = await this.listStudents.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${StudentController.name}:list`);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const dto = StudentByIdDTO.create(req.params.id);
      const result = await this.studentById.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${StudentController.name}:getById`);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto = UpdateStudentDTO.create(req.params.id, req.body);
      const result = await this.updateStudent.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${StudentController.name}:update`);
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const dto = RemoveStudentDTO.create(req.params.id);
      const result = await this.removeStudent.execute(dto);

      if (result.isFailure) {
        return this.handleResult(res, result);
      }

      this.ok(res, { message: "Student removed successfully!" });
    } catch (error) {
      this.handleError(error, res, `${StudentController.name}:remove`);
    }
  }
}
