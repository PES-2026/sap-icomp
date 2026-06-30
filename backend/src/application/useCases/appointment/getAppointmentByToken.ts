import { AppointmentByTokenDTO } from "@application/dtos/appointment/appointmentByToken";
import { ApplicationError } from "@application/errors/applicationError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { AppointmentType } from "@domain/enum/appointmentType";
import { DomainError } from "@domain/errors/domainError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { Result } from "@domain/shared/result";

import { AppointmentResolver } from "./appointmentResolver";

export interface AppointmentDetailsWithPedagogue extends AppointmentResult {
  pedagogueName: string;
}

export class GetAppointmentByToken {
  constructor(
    private readonly appointmentResolver: AppointmentResolver,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    dto: AppointmentByTokenDTO,
  ): Promise<Result<AppointmentDetailsWithPedagogue, ApplicationError | DomainError>> {
    let appointmentValidation = await this.appointmentResolver.execute({
      type: AppointmentType.STUDENT,
      token: dto.token,
    });

    if (appointmentValidation.isFailure) {
      appointmentValidation = await this.appointmentResolver.execute({
        type: AppointmentType.GUEST,
        token: dto.token,
      });
    }

    if (appointmentValidation.isFailure) {
      return Result.fail(appointmentValidation.error!);
    }

    const appointment = appointmentValidation.getValue();
    const pedagogue = await this.pedagogueRepository.findById(appointment.pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError(appointment.pedagogueId));
    }
    const pedagogueName = pedagogue.name;
    const courseId = appointment.studentCourse;
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      return Result.fail(new CourseNotFoundError(appointment.studentCourse));
    }
    const courseName = course.name;

    appointment.studentCourse = courseName;

    return Result.ok({
      ...appointment,
      pedagogueName,
    });
  }
}
