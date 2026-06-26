import { CancelAppointmentPedagogueDTO } from "@application/dtos/appointment/cancelAppointmentPedagogue";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { Result } from "@domain/shared/result";

import { CancelAppointment, ExecuteCancelReturn } from "./cancelAppointment";

export class CancelAppointmentPedagogue {
  constructor(private readonly cancelAppointment: CancelAppointment) {}

  async execute(dto: CancelAppointmentPedagogueDTO): Promise<Result<ExecuteCancelReturn>> {
    const cancelAppointmentValidation = await this.cancelAppointment.execute({
      type: dto.type,
      status: AppointmentStatusEnum.CANCELED_BY_PEDAGOGUE,
      id: dto.id,
    });
    if (cancelAppointmentValidation.isFailure) {
      return Result.fail(cancelAppointmentValidation.error!);
    }
    const cancelValue = cancelAppointmentValidation.getValue();

    return Result.ok(cancelValue);
  }
}
