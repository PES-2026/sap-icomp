import { ApplicationError } from "@application/errors/applicationError";
import { AppointmentCancelledByPedagogueError } from "@application/errors/appointment/appointmentCancelledByPedagogueError";
import { AppointmentCancelledByStudentError } from "@application/errors/appointment/appointmentCancelledByStudentError";
import { AppointmentCompletedError } from "@application/errors/appointment/appointmentCompletedError";
import { AppointmentExpiredError } from "@application/errors/appointment/appointmentExpiredError";
import { AppointmentMissedError } from "@application/errors/appointment/appointmentMissedError";
import { AppointmentResolverOnlyByIdTokenError } from "@application/errors/appointment/appointmentResolverOnlyByIdTokenError";
import { EmailToStudentNotSendError } from "@application/errors/appointment/emailToStudentNotSendError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { AppointmentType } from "@domain/enum/appointmentType";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { UserResult } from "@domain/repositories/results/userResult";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";

import { AppointmentResolver } from "./appointmentResolver";

type ExecuteProps = {
  type: AppointmentType;
  status: AppointmentStatusEnum;
  id?: string;
  token?: string;
  reason?: string;
};

export type ExecuteCancelReturn = {
  messsage: string;
  appointment: AppointmentResult;
};

export class CancelAppointment {
  constructor(
    private readonly appointmentResolver: AppointmentResolver,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentGuestRepository: IAppointmentGuestRepository,
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(props: ExecuteProps): Promise<Result<ExecuteCancelReturn>> {
    let appointmentValidation: Result<AppointmentResult>;
    if (props.id) {
      appointmentValidation = await this.appointmentResolver.execute({ type: props.type, id: props.id });
    } else if (props.token) {
      appointmentValidation = await this.appointmentResolver.execute({ type: props.type, token: props.token });
    } else {
      return Result.fail(new AppointmentResolverOnlyByIdTokenError());
    }
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

    const statusOnDbValidation = await this.cancelStatusOnDatabases(
      appointment,
      props.type,
      props.status,
      props.reason,
    );
    if (statusOnDbValidation.isFailure) {
      return Result.fail(statusOnDbValidation.error!);
    }
    const statusValue = statusOnDbValidation.getValue();

    await this.releaseAvailabilitySlot(appointment.availabilityId);

    const studentEmailValidation = await this.sendStudentEmail(appointment, pedagogue, props.reason);
    if (studentEmailValidation.isFailure) {
      return Result.fail(studentEmailValidation.error!);
    }
    const pedagogueEmailValidation = await this.sendPedagogueEmail(appointment, pedagogue, props.reason);
    if (pedagogueEmailValidation.isFailure) {
      return Result.fail(pedagogueEmailValidation.error!);
    }

    return Result.ok({ appointment: statusValue, messsage: "Appointment successfully cancelled!" });
  }

  private async cancelStatusOnDatabases(
    appointment: AppointmentResult,
    type: AppointmentType,
    status: AppointmentStatusEnum,
    reason?: string,
  ): Promise<Result<AppointmentResult>> {
    const statusValidation = AppointmentStatusVO.from(status);
    if (statusValidation.isFailure) {
      return Result.fail(statusValidation.error!);
    }
    const statusValue = statusValidation.getValue();

    if (type === AppointmentType.GUEST) {
      await this.appointmentGuestRepository.updateStatus(appointment.id, statusValue, reason);
    } else if (type === AppointmentType.STUDENT) {
      await this.appointmentRepository.updateStatus(appointment.id, statusValue, reason);
    }

    const appointmentValidation = await this.appointmentResolver.execute({
      type: appointment.type,
      id: appointment.id,
    });
    if (appointmentValidation.isFailure) {
      return Result.fail(appointmentValidation.error!);
    }
    const appointmentValue = appointmentValidation.getValue();

    return Result.ok(appointmentValue);
  }

  private async releaseAvailabilitySlot(availabilityId: string) {
    // const newAvailabii;
    await this.availabilityRepository.releaseAvailabilityById(availabilityId);
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
        return Result.ok();
      case AppointmentStatusEnum.PENDING:
        return Result.ok();
    }
  }

  private async sendStudentEmail(
    appointment: AppointmentResult,
    pedagogue: UserResult,
    reason?: string,
  ): Promise<Result<void>> {
    try {
      await this.emailService.sendAppointmentCancelledStudentEmail(appointment.studentEmail, {
        name: appointment.studentName,
        pedagogue: pedagogue.name,
        date: appointment.startDate.toLocaleDateString("pt-BR"),
        startTime: formatTime(appointment.startDate),
        endTime: formatTime(appointment.endDate),
        reason: reason ?? "Não informado",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }

  private async sendPedagogueEmail(
    appointment: AppointmentResult,
    pedagogue: UserResult,
    reason?: string,
  ): Promise<Result<void>> {
    try {
      await this.emailService.sendAppointmentCancelledPedagogueEmail(pedagogue.email, {
        pedagogueName: pedagogue.name,
        studentName: appointment.studentName,
        enrollment: appointment.studentEnrollment,
        course: appointment.studentCourse,
        date: appointment.startDate.toLocaleDateString("pt-BR"),
        startTime: formatTime(appointment.startDate),
        endTime: formatTime(appointment.endDate),
        reason: reason ?? "Não informado",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }
}
