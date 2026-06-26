import { NoAvailabilityError } from "@application/errors/appointment/noAvailabilityError";
import { RequestedAppointmentUncoveredError } from "@application/errors/appointment/requestedAppointmentUncoveredError";
import { AvailabilityNotAvailableForAppointmentError } from "@application/errors/availability/availabilityNotAvailableForAppointmentError";
import { RetroactiveDateError } from "@application/errors/availability/retroactiveDateError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { AvailabilityStatusEnum } from "@domain/enum/availabilityStatus";
import { DomainError } from "@domain/errors/domainError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { AvailabilityResult } from "@domain/repositories/results/availabilityResult";
import { UserResult } from "@domain/repositories/results/userResult";
import { Result } from "@domain/shared/result";

type ExecuteProps = {
  availabilitySlotId: string;
  pedagogueId: string;
};

export class ValidateAvailability {
  constructor(
    private availabilityRepository: IAvailabilityRepository,
    private pedagogueRepository: IPedagogueRepository,
  ) {}

  async execute(props: ExecuteProps): Promise<Result<AvailabilityResult, DomainError>> {
    const availabilitySlotValidation = await this.validateAvailability(props.availabilitySlotId);
    if (availabilitySlotValidation?.isFailure) {
      return Result.fail(availabilitySlotValidation.error!);
    }

    const availabilitySlot = availabilitySlotValidation.getValue();
    const retroactiveDateResult = this.validateRetroactiveDate(availabilitySlot);

    if (retroactiveDateResult.isFailure) {
      return Result.fail(retroactiveDateResult.error!);
    }

    const pedagogueResult = await this.getPedagogue(props.pedagogueId);
    if (pedagogueResult.isFailure) {
      return Result.fail(pedagogueResult.error!);
    }

    const uncoveredAppointmentValidation = this.validateUncoveredAvailability(
      props.pedagogueId,
      availabilitySlot.startDateTime,
      availabilitySlot.endDateTime,
      availabilitySlot,
    );
    if (uncoveredAppointmentValidation.isFailure) {
      return Result.fail(uncoveredAppointmentValidation.error!);
    }

    return Result.ok(availabilitySlot);
  }

  private validateRetroactiveDate(slot: AvailabilityResult): Result<void, RetroactiveDateError> {
    const now = new Date();
    if (slot.startDateTime < now) {
      return Result.fail(new RetroactiveDateError());
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

  private async validateAvailability(availabilityId: string): Promise<Result<AvailabilityResult>> {
    const availabilitySlot = await this.availabilityRepository.findById(availabilityId);

    if (!availabilitySlot) {
      return Result.fail(new NoAvailabilityError(availabilityId));
    }
    if (availabilitySlot.status !== AvailabilityStatusEnum.CREATED) {
      return Result.fail(new AvailabilityNotAvailableForAppointmentError(availabilityId));
    }
    return Result.ok(availabilitySlot);
  }

  private validateUncoveredAvailability(
    pedagogueId: string,
    startTime: Date,
    endDate: Date,
    availabilitySlot: AvailabilityResult,
  ): Result<void, RequestedAppointmentUncoveredError> {
    const totalDurationMs = endDate.getTime() - startTime.getTime();
    let slotsDurationMs = 0;

    slotsDurationMs += availabilitySlot.endDateTime.getTime() - availabilitySlot.startDateTime.getTime();

    if (slotsDurationMs < totalDurationMs) {
      return Result.fail(
        new RequestedAppointmentUncoveredError(
          pedagogueId,
          startTime.toISOString(),
          endDate.toISOString(),
          startTime.toDateString(),
        ),
      );
    }
    return Result.ok();
  }
}
