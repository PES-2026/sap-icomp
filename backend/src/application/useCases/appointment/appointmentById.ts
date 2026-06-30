import { AppointmentByIdDTO } from "@application/dtos/appointment/appointmentById";
import { AppointmentResult } from "@domain/repositories/results/appointmentResult";
import { Result } from "@domain/shared/result";

import { AppointmentResolver } from "./appointmentResolver";

export class AppointmentById {
  constructor(private appointmentResolver: AppointmentResolver) {}

  async execute(dto: AppointmentByIdDTO): Promise<Result<AppointmentResult>> {
    const appointmentValidation = await this.appointmentResolver.execute({ type: dto.type, id: dto.id });
    if (appointmentValidation.isFailure) {
      return Result.fail(appointmentValidation.error!);
    }
    const appointment = appointmentValidation.getValue();

    return Result.ok(appointment);
  }
}
