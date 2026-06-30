import { ConfirmAppointmentDTO, ConfirmAppointmentResponse } from "@application/dtos/appointment/confirmAppointment";
import { ApplicationError } from "@application/errors/applicationError";
import { AppointmentCancelledByPedagogueError } from "@application/errors/appointment/appointmentCancelledByPedagogueError";
import { AppointmentCancelledByStudentError } from "@application/errors/appointment/appointmentCancelledByStudentError";
import { AppointmentCompletedError } from "@application/errors/appointment/appointmentCompletedError";
import { AppointmentConfirmedError } from "@application/errors/appointment/appointmentConfirmedError";
import { AppointmentExpiredError } from "@application/errors/appointment/appointmentExpiredError";
import { AppointmentMissedError } from "@application/errors/appointment/appointmentMissedError";
import { EmailToStudentNotSendError } from "@application/errors/appointment/emailToStudentNotSendError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { AppointmentType } from "@domain/enum/appointmentType";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { UserResult } from "@domain/repositories/results/userResult";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";

import { AppointmentResolver } from "./appointmentResolver";

export class ConfirmAppointment {
  constructor(
    private readonly appointmentResolver: AppointmentResolver,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentGuestRepository: IAppointmentGuestRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: ConfirmAppointmentDTO): Promise<Result<ConfirmAppointmentResponse>> {
    const appointmentValidation = await this.appointmentResolver.execute({ type: dto.type, id: dto.id });
    if (appointmentValidation.isFailure) {
      return Result.fail(appointmentValidation.error!);
    }
    const appointment = appointmentValidation.getValue();

    const pedagogue = await this.pedagogueRepository.findById(appointment.pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }

    const statusValidation = this.validateAppointmentStatus(
      appointment.status,
      appointment.studentName,
      pedagogue.name,
      appointment.id,
    );

    if (statusValidation.isFailure) {
      return Result.fail(statusValidation.error!);
    }

    const statusOnDbValidation = await this.confirmStatusOnDatabases(appointment, dto.type);
    if (statusOnDbValidation.isFailure!) {
      return Result.fail(statusOnDbValidation.error!);
    }

    const studentEmailValidation = await this.sendStudentEmail(appointment, pedagogue);
    if (studentEmailValidation.isFailure) {
      return Result.fail(studentEmailValidation.error!);
    }
    const pedagogueEmailValidation = await this.sendPedagogueEmail(appointment, pedagogue);
    if (pedagogueEmailValidation.isFailure) {
      return Result.fail(pedagogueEmailValidation.error!);
    }

    return Result.ok({ appointmentId: appointment.id, message: "Appointment sucessfully confirmed" });
  }

  private validateAppointmentStatus(
    status: AppointmentStatusEnum,
    studentName: string,
    pedagogueName: string,
    appointmentId: string,
  ): Result<void, ApplicationError> {
    switch (status) {
      case AppointmentStatusEnum.CANCELED_BY_STUDENT:
        return Result.fail(new AppointmentCancelledByStudentError(appointmentId, studentName));
      case AppointmentStatusEnum.CANCELED_BY_PEDAGOGUE:
        return Result.fail(new AppointmentCancelledByPedagogueError(appointmentId, pedagogueName));
      case AppointmentStatusEnum.MISSED:
        return Result.fail(new AppointmentMissedError(appointmentId));
      case AppointmentStatusEnum.EXPIRED:
        return Result.fail(new AppointmentExpiredError(appointmentId));
      case AppointmentStatusEnum.COMPLETED:
        return Result.fail(new AppointmentCompletedError(appointmentId));
      case AppointmentStatusEnum.CONFIRMED:
        return Result.fail(new AppointmentConfirmedError(appointmentId));
      case AppointmentStatusEnum.PENDING:
        return Result.ok();
    }
  }

  private async confirmStatusOnDatabases(
    appointment: AppointmentResult,
    type: AppointmentType,
  ): Promise<Result<void>> {
    const statusValidation = AppointmentStatusVO.from(AppointmentStatusEnum.CONFIRMED);
    if (statusValidation.isFailure) {
      return Result.fail(statusValidation.error!);
    }
    const statusValue = statusValidation.getValue();

    if (type === AppointmentType.GUEST) {
      await this.appointmentGuestRepository.updateStatus(appointment.id, statusValue);
    } else if (type === AppointmentType.STUDENT) {
      await this.appointmentRepository.updateStatus(appointment.id, statusValue);
    }

    return Result.ok();
  }

  private async sendStudentEmail(appointment: AppointmentResult, pedagogue: UserResult): Promise<Result<void>> {
    try {
      await this.emailService.sendAppointmentConfirmedStudentEmail(appointment.studentEmail, {
        studentName: appointment.studentName,
        pedagogueName: pedagogue.name,
        date: appointment.startDate.toLocaleDateString("pt-BR"),
        startTime: formatTime(appointment.startDate),
        endTime: formatTime(appointment.endDate),
        duration: `${appointment.attendanceTime} minutos`,
        course: appointment.studentCourse,
        reason: appointment.reason ?? "Não informado",
        token: appointment.token,
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }

  private async sendPedagogueEmail(appointment: AppointmentResult, pedagogue: UserResult): Promise<Result<void>> {
    try {
      await this.emailService.sendAppointmentConfirmedPedagogueEmail(pedagogue.email, {
        studentName: appointment.studentName,
        email: appointment.studentEmail,
        pedagogueName: pedagogue.name,
        enrollment: appointment.studentEnrollment,
        date: appointment.startDate.toLocaleDateString("pt-BR"),
        startTime: formatTime(appointment.startDate),
        endTime: formatTime(appointment.endDate),
        duration: `${appointment.attendanceTime} minutos`,
        course: appointment.studentCourse,
        reason: appointment.reason ?? "Não informado",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }
}
