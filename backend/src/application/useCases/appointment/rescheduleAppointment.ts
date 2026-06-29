import { ApplicationError } from "@application/errors/applicationError";
import { AppointmentNotFoundError } from "@application/errors/appointment/appointmentNotFoundError";
import { AppointmentResolverOnlyByIdTokenError } from "@application/errors/appointment/appointmentResolverOnlyByIdTokenError";
import { EmailToPedagogueNotSendError } from "@application/errors/appointment/emailToPedagogueNotSendError";
import { EmailToStudentNotSendError } from "@application/errors/appointment/emailToStudentNotSendError";
import { AppointmentTypeNotFoundError } from "@application/errors/availability/appointmentTypeNotFoundError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { Appointment } from "@domain/entities/appointment";
import { AppointmentGuest } from "@domain/entities/appointmentGuest";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { AppointmentType } from "@domain/enum/appointmentType";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { AvailabilityResult } from "@domain/repositories/results/availabilityResult";
import { UserResult } from "@domain/repositories/results/userResult";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";
import { ReasonVO } from "@domain/valueObjects/appointment/reason";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";

import { ValidateAvailability } from "../availability/validateAvailability";

import { AppointmentResolver } from "./appointmentResolver";

type ExecuteProps = {
  type: AppointmentType;
  newAvailabilityId: string;
  appointmentId?: string;
  appointmentToken?: string;
  reason?: string | undefined;
};

export class RescheduleAppointment {
  constructor(
    private readonly appointmentResolver: AppointmentResolver,
    private readonly validateAvailability: ValidateAvailability,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentGuestRepository: IAppointmentGuestRepository,
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(props: ExecuteProps): Promise<Result<void, ApplicationError>> {
    let appointmentValidation: Result<AppointmentResult>;
    if (props.appointmentId) {
      appointmentValidation = await this.appointmentResolver.execute({ type: props.type, id: props.appointmentId });
    } else if (props.appointmentToken) {
      appointmentValidation = await this.appointmentResolver.execute({
        type: props.type,
        token: props.appointmentToken,
      });
    } else {
      return Result.fail(new AppointmentResolverOnlyByIdTokenError());
    }
    if (appointmentValidation.isFailure) {
      return Result.fail(appointmentValidation.error!);
    }
    const previousAppointment = appointmentValidation.getValue();

    const newAvailabilityValidation = await this.validateAvailability.execute({
      availabilitySlotId: props.newAvailabilityId,
      pedagogueId: previousAppointment.pedagogueId,
    });
    if (newAvailabilityValidation.isFailure) {
      return Result.fail(newAvailabilityValidation.error!);
    }
    const newAvailability = newAvailabilityValidation.getValue();

    const pedagogueResult = await this.getPedagogue(previousAppointment.pedagogueId);
    if (pedagogueResult.isFailure) {
      return Result.fail(pedagogueResult.error!);
    }
    const pedagogue = pedagogueResult.getValue();

    await this.releasePreviousAvailability(previousAppointment);
    await this.bookNewAvailability(newAvailability, previousAppointment.id, previousAppointment.type);

    const newAppointmentValidation = await this.saveAppoinmentWithNewAvailaibility(
      previousAppointment,
      newAvailability,
      props.reason,
    );
    if (newAppointmentValidation.isFailure) {
      return Result.fail(newAppointmentValidation.error!);
    }
    const newAppointment = appointmentValidation.getValue();

    const studentEmailValidation = await this.sendStudentEmail(previousAppointment, newAppointment, pedagogue);
    if (studentEmailValidation.isFailure) {
      return Result.fail(studentEmailValidation.error!);
    }
    const pedagogueEmailValidation = await this.sendPedagogueEmail(previousAppointment, newAppointment, pedagogue);
    if (pedagogueEmailValidation.isFailure) {
      return Result.fail(pedagogueEmailValidation.error!);
    }

    return Result.ok();
  }

  private async getPedagogue(pedagogueId: string): Promise<Result<UserResult, PedagogueNotFoundError>> {
    const pedagogue = await this.pedagogueRepository.findById(pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }
    return Result.ok<UserResult>(pedagogue);
  }

  private async releasePreviousAvailability(previousAppointment: AppointmentResult) {
    await this.availabilityRepository.releaseAvailabilityById(previousAppointment.availabilityId);
  }

  private async bookNewAvailability(
    newAvailability: AvailabilityResult,
    appointmentId: string,
    type: AppointmentType,
  ) {
    await this.availabilityRepository.bookAvailabilityById(newAvailability.id, appointmentId, type);
  }

  private async sendStudentEmail(
    previousAppointment: AppointmentResult,
    newAppointment: AppointmentResult,
    pedagogue: UserResult,
  ): Promise<Result<void>> {
    try {
      await this.emailService.sendRescheduledAppointmentStudentEmail(newAppointment.studentEmail, {
        name: newAppointment.studentName,
        pedagogue: pedagogue.name,
        previousDate: previousAppointment.startDate.toLocaleDateString("pt-BR"),
        previousStartTime: formatTime(previousAppointment.startDate),
        previousEndTime: formatTime(previousAppointment.endDate),
        newDate: newAppointment.startDate.toLocaleDateString("pt-BR"),
        newStartTime: formatTime(newAppointment.startDate),
        newEndTime: formatTime(newAppointment.endDate),
        duration: `${newAppointment.attendanceTime} minutos`,
        course: newAppointment.studentCourse,
        reason: newAppointment.reason ?? "Não informado",
        token: newAppointment.token,
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }

  private async sendPedagogueEmail(
    previousAppointment: AppointmentResult,
    newAppointment: AppointmentResult,
    pedagogue: UserResult,
  ): Promise<Result<void>> {
    try {
      await this.emailService.sendRescheduledAppointmentPedagogueEmail(pedagogue.email, {
        pedagogueName: pedagogue.name,
        studentName: newAppointment.studentName,
        enrollment: newAppointment.studentEnrollment,
        course: newAppointment.studentCourse,
        previousDate: previousAppointment.startDate.toLocaleDateString("pt-BR"),
        previousStartTime: formatTime(previousAppointment.startDate),
        previousEndTime: formatTime(previousAppointment.endDate),
        newDate: newAppointment.startDate.toLocaleDateString("pt-BR"),
        newStartTime: formatTime(newAppointment.startDate),
        newEndTime: formatTime(newAppointment.endDate),
        duration: `${newAppointment.attendanceTime} minutos`,
        reason: newAppointment.reason ?? "Não informado",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the pedagogue: ${error}`);
      return Result.fail(new EmailToPedagogueNotSendError());
    }
  }

  private async saveAppoinmentWithNewAvailaibility(
    previousAppointment: AppointmentResult,
    newAvailability: AvailabilityResult,
    reason?: string,
  ): Promise<Result<AppointmentResult>> {
    const statusVO = AppointmentStatusVO.from(AppointmentStatusEnum.PENDING);
    if (statusVO.isFailure) {
      return Result.fail(statusVO.error!);
    }
    const statusValue = statusVO.getValue();

    const newAvailabilityIdVO = ExternalIdVO.from(newAvailability.id);
    if (newAvailabilityIdVO.isFailure) {
      return Result.fail(newAvailabilityIdVO.error!);
    }
    const newAvailabilityIdValue = newAvailabilityIdVO.getValue();

    let reasonValue: ReasonVO | undefined = undefined;
    if (reason) {
      const reasonVO = ReasonVO.create(reason);
      if (reasonVO.isFailure) {
        return Result.fail(reasonVO.error!);
      }
      reasonValue = reasonVO.getValue();
    }

    if (previousAppointment.type === AppointmentType.GUEST) {
      const appointmentGuest = this.createAppointmentGuestStudentEntity(previousAppointment);
      if (reasonValue) {
        appointmentGuest.update({ status: statusValue, availabilityId: newAvailabilityIdValue, reason: reasonValue });
      } else {
        appointmentGuest.update({ status: statusValue, availabilityId: newAvailabilityIdValue });
      }
      await this.appointmentGuestRepository.update(appointmentGuest);

      const newAppointment = await this.appointmentGuestRepository.findById(appointmentGuest.id.value);

      if (!newAppointment) {
        return Result.fail(new AppointmentNotFoundError(appointmentGuest.id.value));
      }

      return Result.ok(newAppointment);
    } else if (previousAppointment.type === AppointmentType.STUDENT) {
      const appointment = this.createAppointmentWithStudentEntity(previousAppointment);
      if (reasonValue) {
        appointment.update({ status: statusValue, availabilityId: newAvailabilityIdValue, reason: reasonValue });
      } else {
        appointment.update({ status: statusValue, availabilityId: newAvailabilityIdValue });
      }
      await this.appointmentRepository.update(appointment);

      const newAppointment = await this.appointmentRepository.findById(appointment.id.value);

      if (!newAppointment) {
        return Result.fail(new AppointmentNotFoundError(appointment.id.value));
      }

      return Result.ok(newAppointment);
    } else {
      return Result.fail(new AppointmentTypeNotFoundError(previousAppointment.type, Object.values(AppointmentType)));
    }
  }

  private createAppointmentWithStudentEntity(appointment: AppointmentResult): Appointment {
    const appointmentEntity = Appointment.rehydrate({
      id: appointment.id,
      availabilityId: appointment.availabilityId,
      pedagogueId: appointment.pedagogueId,
      status: appointment.status,
      studentId: appointment.studentId!,
      reason: appointment.reason ?? undefined,
      token: appointment.token!,
    });
    return appointmentEntity;
  }

  private createAppointmentGuestStudentEntity(appointment: AppointmentResult): AppointmentGuest {
    const appointmentEntity = AppointmentGuest.rehydrate({
      id: appointment.id,
      availabilityId: appointment.availabilityId,
      pedagogueId: appointment.pedagogueId,
      status: appointment.status,
      courseId: appointment.studentCourse,
      studentEmail: appointment.studentEmail,
      studentEnrollment: appointment.studentEnrollment,
      studentName: appointment.studentName,
      reason: appointment.reason ?? undefined,
      token: appointment.token!,
    });
    return appointmentEntity;
  }
}
