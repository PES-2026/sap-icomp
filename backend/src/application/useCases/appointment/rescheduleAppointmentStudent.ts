import {
  RescheduleAppointmentStudentDTO,
  RescheduleAppointmentResponse,
} from "@application/dtos/appointment/rescheduleAppointmentStudent";
import { ApplicationError } from "@application/errors/applicationError";
import { Result } from "@domain/shared/result";

import { RescheduleAppointment } from "./rescheduleAppointment";

export class RescheduleAppointmentStudent {
  constructor(private readonly rescheduleAppointment: RescheduleAppointment) {}

  async execute(
    dto: RescheduleAppointmentStudentDTO,
  ): Promise<Result<RescheduleAppointmentResponse, ApplicationError>> {
    const rescheduleAppointmentValidation = await this.rescheduleAppointment.execute({
      newAvailabilityId: dto.newAvailabilityId,
      type: dto.type,
      appointmentToken: dto.token,
      reason: dto.reason,
    });
    if (rescheduleAppointmentValidation.isFailure) {
      return Result.fail(rescheduleAppointmentValidation.error!);
    }
    const rescheduleValue = rescheduleAppointmentValidation.getValue();

    return Result.ok(rescheduleValue);
  }
}
