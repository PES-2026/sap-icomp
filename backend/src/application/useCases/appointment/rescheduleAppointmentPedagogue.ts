import { RescheduleAppointmentPedagogueDTO } from "@application/dtos/appointment/rescheduleAppointmentPedagogue";
import { ApplicationError } from "@application/errors/applicationError";
import { Result } from "@domain/shared/result";

import { RescheduleAppointment } from "./rescheduleAppointment";

export class RescheduleAppointmentPedagogue {
  constructor(private readonly rescheduleAppointment: RescheduleAppointment) {}

  async execute(dto: RescheduleAppointmentPedagogueDTO): Promise<Result<void, ApplicationError>> {
    const rescheduleAppointmentValidation = await this.rescheduleAppointment.execute({
      newAvailabilityId: dto.newAvailabilityId,
      type: dto.type,
      appointmentId: dto.appointmentId,
      reason: dto.reason,
    });
    if (rescheduleAppointmentValidation.isFailure) {
      return Result.fail(rescheduleAppointmentValidation.error!);
    }
    const rescheduleValue = rescheduleAppointmentValidation.getValue();

    return Result.ok(rescheduleValue);
  }
}
