import { ApplicationError } from "@application/errors/applicationError";
import { AppointmentTypeNotFoundError } from "@application/errors/availability/appointmentTypeNotFoundError";
import { Appointment } from "@domain/entities/appointment";
import { AppointmentGuest } from "@domain/entities/appointmentGuest";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { AppointmentType } from "@domain/enum/appointmentType";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { Result } from "@domain/shared/result";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";

export class VerifyMissedExpiredStatus {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private appointmentGuestRepository: IAppointmentGuestRepository,
  ) {}

  async execute(appointmentResult: AppointmentResult): Promise<Result<ApplicationError>> {
    const actualDate = new Date();
    let newStatus: AppointmentStatusEnum | null = null;
    if (appointmentResult.endDate < actualDate) {
      if (appointmentResult.status === AppointmentStatusEnum.PENDING) {
        newStatus = AppointmentStatusEnum.EXPIRED;
      } else if (appointmentResult.status === AppointmentStatusEnum.CONFIRMED) {
        newStatus = AppointmentStatusEnum.MISSED;
      }
    }

    if (newStatus) {
      const statusVO = AppointmentStatusVO.from(newStatus);
      if (statusVO.isFailure) {
        return Result.fail(statusVO.error!);
      }
      const statusValue = statusVO.getValue();

      if (appointmentResult.type === AppointmentType.GUEST) {
        const appointmentGuest = this.createAppointmentGuestStudentEntity(appointmentResult);
        appointmentGuest.update({ status: statusValue });
        await this.appointmentGuestRepository.updateStatus(appointmentGuest.id.value, statusValue);
      } else if (appointmentResult.type === AppointmentType.STUDENT) {
        const appointment = this.createAppointmentWithStudentEntity(appointmentResult);
        appointment.update({ status: statusValue });
        await this.appointmentRepository.updateStatus(appointment.id.value, statusValue);
      } else {
        return Result.fail(new AppointmentTypeNotFoundError(appointmentResult.type, Object.values(AppointmentType)));
      }
    }

    return Result.ok();
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
