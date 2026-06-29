import { ListAppointmentsByPedagogueDTO } from "@application/dtos/appointment/listAppointmentsByPedagogue";
import { ApplicationError } from "@application/errors/applicationError";
import { IAppointmentGuestRepository } from "@domain/repositories/appointmentGuestRepository";
import { IAppointmentRepository } from "@domain/repositories/appointmentRepository";
import { AppointmentListParams } from "@domain/repositories/filters/appointmentFilters";
import { PaginatedAppointmentResult } from "@domain/repositories/results/appointmentResult";
import { Result } from "@domain/shared/result";

import { VerifyMissedExpiredStatus } from "./verifyMissedExpiredStatus";

export class ListAppointmentsByPedagogue {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentGuestRepository: IAppointmentGuestRepository,
    private readonly verifyMissedExpiredStatus: VerifyMissedExpiredStatus,
  ) {}

  async execute(dto: ListAppointmentsByPedagogueDTO): Promise<Result<PaginatedAppointmentResult, ApplicationError>> {
    const params: AppointmentListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const appointmentsWithStudents = await this.appointmentRepository.findAll(params);
    const appointmentsGuests = await this.appointmentGuestRepository.findAll(params);
    appointmentsWithStudents.items.push(...appointmentsGuests.items);

    const result: PaginatedAppointmentResult = {
      totalItems: appointmentsWithStudents.totalItems + appointmentsGuests.totalItems,
      totalPages: Math.max(appointmentsWithStudents.totalPages, appointmentsGuests.totalPages),
      currentPage: Math.min(appointmentsWithStudents.currentPage, appointmentsGuests.currentPage),
      items: appointmentsWithStudents.items,
    };

    for (const item of result.items) {
      const validation = await this.verifyMissedExpiredStatus.execute(item);
      if (validation.isFailure) {
        return Result.fail(validation.error!);
      }
    }

    return Result.ok<PaginatedAppointmentResult>(result);
  }
}
