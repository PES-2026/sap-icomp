import { RescheduleAppointmentResponse } from "@application/dtos/appointment/rescheduleAppointmentStudent";
import { ApplicationError } from "@application/errors/applicationError";
import { AppointmentNotFoundError } from "@application/errors/appointment/appointmentNotFoundError";
import { AppointmentResolverOnlyByIdTokenError } from "@application/errors/appointment/appointmentResolverOnlyByIdTokenError";
import { EmailToPedagogueNotSendError } from "@application/errors/appointment/emailToPedagogueNotSendError";
import { EmailToStudentNotSendError } from "@application/errors/appointment/emailToStudentNotSendError";
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

import { ReleaseAvailability } from "../availability/releaseAvailability";
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
    private readonly releaseAvailability: ReleaseAvailability,
  ) {}

  async execute(props: ExecuteProps): Promise<Result<RescheduleAppointmentResponse, ApplicationError>> {
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

    const releaseAvailabilityvalidation = await this.releasePreviousAvailability(previousAppointment.availabilityId);
    if (releaseAvailabilityvalidation.isFailure) {
      return Result.fail(releaseAvailabilityvalidation.error!);
    }

    const cancelStatus = props.appointmentToken
      ? AppointmentStatusEnum.CANCELED_BY_STUDENT
      : AppointmentStatusEnum.CANCELED_BY_PEDAGOGUE;

    const cancelReason = `Reagendado: movido para o horário de ${newAvailability.startDateTime.toLocaleDateString("pt-BR")}`;

    if (previousAppointment.type === AppointmentType.GUEST) {
      await this.appointmentGuestRepository.updateStatus(
        previousAppointment.id,
        AppointmentStatusVO.fromTrusted(cancelStatus),
        cancelReason,
      );
    } else {
      await this.appointmentRepository.updateStatus(
        previousAppointment.id,
        AppointmentStatusVO.fromTrusted(cancelStatus),
        cancelReason,
      );
    }

    const newAppointmentValidation = await this.saveNewAppointmentWithNewAvailability(
      previousAppointment,
      newAvailability,
      props.reason,
    );
    if (newAppointmentValidation.isFailure) {
      return Result.fail(newAppointmentValidation.error!);
    }
    const newAppointment = newAppointmentValidation.getValue();

    await this.bookNewAvailability(newAvailability, newAppointment.id, previousAppointment.type);

    const studentEmailValidation = await this.sendStudentEmail(previousAppointment, newAppointment, pedagogue);
    if (studentEmailValidation.isFailure) {
      return Result.fail(studentEmailValidation.error!);
    }
    const pedagogueEmailValidation = await this.sendPedagogueEmail(previousAppointment, newAppointment, pedagogue);
    if (pedagogueEmailValidation.isFailure) {
      return Result.fail(pedagogueEmailValidation.error!);
    }

    return Result.ok({ appointmentId: newAppointment.id, message: "Appointment successfully rescheduled!" });
  }

  private async getPedagogue(pedagogueId: string): Promise<Result<UserResult, PedagogueNotFoundError>> {
    const pedagogue = await this.pedagogueRepository.findById(pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }
    return Result.ok<UserResult>(pedagogue);
  }

  private async releasePreviousAvailability(previousAvailabilityId: string): Promise<Result<AvailabilityResult>> {
    const releaseAvailabilityValidation = await this.releaseAvailability.execute({
      availabilityId: previousAvailabilityId,
    });
    if (releaseAvailabilityValidation.isFailure) {
      return Result.fail(releaseAvailabilityValidation.error!);
    }
    return Result.ok(releaseAvailabilityValidation.getValue());
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

  private async saveNewAppointmentWithNewAvailability(
    previousAppointment: AppointmentResult,
    newAvailability: AvailabilityResult,
    reason?: string,
  ): Promise<Result<AppointmentResult>> {
    if (previousAppointment.type === AppointmentType.GUEST) {
      const newGuestValidation = AppointmentGuest.create({
        pedagogueId: previousAppointment.pedagogueId,
        availabilityId: newAvailability.id,
        courseId: previousAppointment.studentCourse,
        studentName: previousAppointment.studentName,
        studentEmail: previousAppointment.studentEmail,
        studentEnrollment: previousAppointment.studentEnrollment,
        status: AppointmentStatusEnum.PENDING,
        reason: reason ?? previousAppointment.reason,
      });

      if (newGuestValidation.isFailure) {
        return Result.fail(newGuestValidation.error!);
      }

      const newGuest = newGuestValidation.getValue();
      await this.appointmentGuestRepository.save(newGuest);

      const saved = await this.appointmentGuestRepository.findById(newGuest.id.value);
      if (!saved) {
        return Result.fail(new AppointmentNotFoundError(newGuest.id.value));
      }

      return Result.ok(saved);
    } else {
      const newAppValidation = Appointment.create({
        pedagogueId: previousAppointment.pedagogueId,
        availabilityId: newAvailability.id,
        studentId: previousAppointment.studentId!,
        status: AppointmentStatusEnum.PENDING,
        reason: reason ?? previousAppointment.reason,
      });

      if (newAppValidation.isFailure) {
        return Result.fail(newAppValidation.error!);
      }

      const newApp = newAppValidation.getValue();
      await this.appointmentRepository.save(newApp);

      const saved = await this.appointmentRepository.findById(newApp.id.value);
      if (!saved) {
        return Result.fail(new AppointmentNotFoundError(newApp.id.value));
      }

      return Result.ok(saved);
    }
  }
}
