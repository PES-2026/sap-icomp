import { AppointmentNotFoundError } from "@application/errors/appointment/appointmentNotFoundError";
import { AppointmentResolverOnlyByIdTokenError } from "@application/errors/appointment/appointmentResolverOnlyByIdTokenError";
import { AppointmentTypeNotFoundError } from "@application/errors/availability/appointmentTypeNotFoundError";
import { AppointmentType } from "@domain/enum/appointmentType";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { Result } from "@domain/shared/result";

import { VerifyMissedExpiredStatus } from "./verifyMissedExpiredStatus";

type ExecuteProps = {
  type: AppointmentType;
  id?: string;
  token?: string;
};

export class AppointmentResolver {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentGuestRepository: IAppointmentGuestRepository,
    private readonly verifyMissedExpiredStatus: VerifyMissedExpiredStatus,
  ) {}

  async execute(props: ExecuteProps): Promise<Result<AppointmentResult>> {
    let appointment: AppointmentResult;
    if (props.id) {
      const appointmentByIdValidation = await this.getById(props.id, props.type);
      if (appointmentByIdValidation.isFailure) {
        return Result.fail(appointmentByIdValidation.error!);
      }
      appointment = appointmentByIdValidation.getValue();
    } else if (props.token) {
      const appointmentByTokenValidation = await this.getByToken(props.token, props.type);
      if (appointmentByTokenValidation.isFailure) {
        return Result.fail(appointmentByTokenValidation.error!);
      }
      appointment = appointmentByTokenValidation.getValue();
    } else {
      return Result.fail(new AppointmentResolverOnlyByIdTokenError());
    }

    const validation = await this.verifyMissedExpiredStatus.execute(appointment);
    if (validation.isFailure) {
      return Result.fail(validation.error!);
    }

    return Result.ok(appointment);
  }

  private async getById(id: string, type: AppointmentType): Promise<Result<AppointmentResult>> {
    let appointment: AppointmentResult | null;
    if (type === AppointmentType.STUDENT) {
      appointment = await this.appointmentRepository.findById(id);
    } else if (type === AppointmentType.GUEST) {
      appointment = await this.appointmentGuestRepository.findById(id);
    } else {
      return Result.fail(new AppointmentTypeNotFoundError(type, Object.values(AppointmentType)));
    }
    if (!appointment) {
      return Result.fail(new AppointmentNotFoundError(id));
    }
    return Result.ok(appointment);
  }

  private async getByToken(token: string, type: AppointmentType): Promise<Result<AppointmentResult>> {
    let appointment: AppointmentResult | null;
    if (type === AppointmentType.STUDENT) {
      appointment = await this.appointmentRepository.findByToken(token);
    } else if (type === AppointmentType.GUEST) {
      appointment = await this.appointmentGuestRepository.findByToken(token);
    } else {
      return Result.fail(new AppointmentTypeNotFoundError(type, Object.values(AppointmentType)));
    }
    if (!appointment) {
      return Result.fail(new AppointmentNotFoundError(token));
    }
    return Result.ok(appointment);
  }
}
