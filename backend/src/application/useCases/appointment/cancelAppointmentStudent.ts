import { CancelAppointmentStudentDTO } from "@application/dtos/appointment/cancelAppointmentStudent";
import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { Result } from "@domain/shared/result";

import { CancelAppointment, ExecuteCancelReturn } from "./cancelAppointment";

export class CancelAppointmentStudent {
  constructor(private readonly cancelAppointment: CancelAppointment) {}

  async execute(dto: CancelAppointmentStudentDTO): Promise<Result<ExecuteCancelReturn>> {
    const cancelAppointmentValidation = await this.cancelAppointment.execute({
      type: dto.type,
      status: AppointmentStatusEnum.CANCELED_BY_STUDENT,
      token: dto.token,
    });
    if (cancelAppointmentValidation.isFailure) {
      return Result.fail(cancelAppointmentValidation.error!);
    }
    const cancelValue = cancelAppointmentValidation.getValue();

    return Result.ok(cancelValue);
  }
}
