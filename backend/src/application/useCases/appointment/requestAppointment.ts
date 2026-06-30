import { ApplicationError } from "@application/errors/applicationError";
import { AppointmentNotCreatedError } from "@application/errors/appointment/appointmentNotCreatedError";
import { EmailToPedagogueNotSendError } from "@application/errors/appointment/emailToPedagogueNotSendError";
import { EmailToStudentNotSendError } from "@application/errors/appointment/emailToStudentNotSendError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { Appointment } from "@domain/entities/appointment";
import { AppointmentGuest } from "@domain/entities/appointmentGuest";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { CourseItem } from "@domain/repositories/results/courseResult";
import { UserResult } from "@domain/repositories/results/userResult";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";

import { RequestAppointmentDTO, RequestAppointmentResponse } from "../../dtos/appointment/requestAppointment";
import { ValidateAvailability } from "../availability/validateAvailability";

export class RequestAppointment {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentGuestRepository: IAppointmentGuestRepository,
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly emailService: IEmailService,
    private readonly validateAvailability: ValidateAvailability,
  ) {}

  async execute(dto: RequestAppointmentDTO): Promise<Result<RequestAppointmentResponse, ApplicationError>> {
    const availabilityValidation = await this.validateAvailability.execute({
      availabilitySlotId: dto.availabilitySlotId,
      pedagogueId: dto.pedagogueId,
    });
    if (availabilityValidation.isFailure) {
      return Result.fail(availabilityValidation.error!);
    }
    const availability = availabilityValidation.getValue();

    const UserResult = await this.getPedagogue(dto.pedagogueId);
    if (UserResult.isFailure) {
      return Result.fail(UserResult.error!);
    }
    const pedagogue = UserResult.getValue();

    const appointmentSaveValidation = await this.saveAppointmentOnDatabase(dto);
    if (appointmentSaveValidation.isFailure) {
      return Result.fail(appointmentSaveValidation.error!);
    }
    const appointmentValue = appointmentSaveValidation.getValue();

    await this.availabilityRepository.bookAvailabilityById(
      availability.id,
      appointmentValue.id,
      appointmentValue.type,
    );

    const courseValidation = await this.getCourse(dto.courseId);
    if (courseValidation.isFailure) {
      return Result.fail(courseValidation.error!);
    }

    const studentEmailValidation = await this.sendStudentEmail(appointmentValue, pedagogue);
    if (studentEmailValidation.isFailure) {
      return Result.fail(studentEmailValidation.error!);
    }

    const pedagogueEmailValidation = await this.sendPedagogueEmail(appointmentValue, pedagogue);
    if (pedagogueEmailValidation.isFailure) {
      return Result.fail(pedagogueEmailValidation.error!);
    }

    if (appointmentValue instanceof AppointmentGuest) {
      return Result.ok({
        appointmentId: appointmentValue.id,
        message:
          "The appointment was successfully requested as a Guest Student and is pending approval from the pedagogue.",
      });
    } else {
      return Result.ok({
        appointmentId: appointmentValue.id,
        message: "The appointment was successfully requested and is pending approval from the pedagogue.",
      });
    }
  }

  private async getPedagogue(pedagogueId: string): Promise<Result<UserResult, PedagogueNotFoundError>> {
    const pedagogue = await this.pedagogueRepository.findById(pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }
    return Result.ok<UserResult>(pedagogue);
  }

  private async saveAppointmentOnDatabase(dto: RequestAppointmentDTO): Promise<Result<AppointmentResult>> {
    const student = await this.studentRepository.findByEmail(dto.email);

    if (!student) {
      const appointmentGuestValidation = this.createAppointmentToGuestStudent(
        dto.pedagogueId,
        dto.availabilitySlotId,
        dto.courseId,
        dto.name,
        dto.email,
        dto.enrollment,
        dto.reason,
      );

      if (appointmentGuestValidation.isFailure) {
        return Result.fail(appointmentGuestValidation.error!);
      }

      const appointmentGuestValue = appointmentGuestValidation.getValue();
      await this.appointmentGuestRepository.save(appointmentGuestValue);
      const appointmentGuestOnDb = await this.appointmentGuestRepository.findById(appointmentGuestValue.id.value);
      if (!appointmentGuestOnDb) {
        return Result.fail(new AppointmentNotCreatedError(appointmentGuestValue.id.value));
      }

      return Result.ok(appointmentGuestOnDb);
    } else {
      const appointmentValidation = this.createAppointmentToExistingStudent(
        dto.pedagogueId,
        dto.availabilitySlotId,
        student.id,
        dto.reason,
      );

      if (appointmentValidation.isFailure) {
        return Result.fail(appointmentValidation.error!);
      }

      const appointmentValue = appointmentValidation.getValue();
      await this.appointmentRepository.save(appointmentValue);
      const appointmentOnDb = await this.appointmentRepository.findById(appointmentValue.id.value);
      if (!appointmentOnDb) {
        return Result.fail(new AppointmentNotCreatedError(appointmentValue.id.value));
      }

      return Result.ok(appointmentOnDb);
    }
  }

  private createAppointmentToExistingStudent(
    pedagogueId: string,
    availabilityId: string,
    studentId: string,
    reason?: string | undefined,
  ): Result<Appointment> {
    const appoinmentStudentEntityValidation = Appointment.create({
      pedagogueId: pedagogueId,
      availabilityId: availabilityId,
      studentId: studentId,
      status: AppointmentStatusEnum.PENDING,
      reason: reason,
    });

    if (appoinmentStudentEntityValidation.isFailure) {
      return Result.fail(appoinmentStudentEntityValidation.error!);
    }

    const appointmentStudentResult = appoinmentStudentEntityValidation.getValue();
    return Result.ok(appointmentStudentResult);
  }

  private createAppointmentToGuestStudent(
    pedagogueId: string,
    availabilityId: string,
    courseId: string,
    studentName: string,
    studentEmail: string,
    studentEnrollment: string,
    reason?: string | undefined,
  ): Result<AppointmentGuest> {
    const appoinmentGuestEntityValidation = AppointmentGuest.create({
      pedagogueId: pedagogueId,
      availabilityId: availabilityId,
      courseId: courseId,
      studentName: studentName,
      studentEmail: studentEmail,
      studentEnrollment: studentEnrollment,
      status: AppointmentStatusEnum.PENDING,
      reason: reason,
    });

    if (appoinmentGuestEntityValidation.isFailure) {
      return Result.fail(appoinmentGuestEntityValidation.error!);
    }

    const appointmentGuestResult = appoinmentGuestEntityValidation.getValue();
    return Result.ok(appointmentGuestResult);
  }

  private async getCourse(courseId: string): Promise<Result<CourseItem>> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      return Result.fail(new CourseNotFoundError(courseId));
    }

    return Result.ok(course);
  }

  private async sendStudentEmail(appointment: AppointmentResult, pedagogue: UserResult): Promise<Result<void>> {
    try {
      await this.emailService.sendAppointmentRequestedStudentEmail(appointment.studentEmail, {
        name: appointment.studentName,
        pedagogue: pedagogue.name,
        date: appointment.startDate.toLocaleDateString(),
        startTime: appointment.startDate.toLocaleTimeString(),
        endTime: appointment.endDate.toLocaleTimeString(),
        duration: `${appointment.attendanceTime} minutos`,
        course: appointment.studentCourse,
        token: appointment.token,
        reason: appointment.reason ?? "Não informada",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }

  private async sendPedagogueEmail(appointment: AppointmentResult, pedagogue: UserResult): Promise<Result<void>> {
    try {
      await this.emailService.sendAppointmentRequestedPedagogueEmail(pedagogue.email, {
        pedagogueName: pedagogue.name,
        studentName: appointment.studentName,
        course: appointment.studentCourse,
        email: appointment.studentEmail,
        date: appointment.startDate.toLocaleDateString(),
        startTime: appointment.startDate.toLocaleTimeString(),
        endTime: appointment.endDate.toLocaleTimeString(),
        duration: `${appointment.attendanceTime} minutos`,
        reason: appointment.reason ?? "Não informada",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the pedagogue: ${error}`);
      return Result.fail(new EmailToPedagogueNotSendError());
    }
  }
}
