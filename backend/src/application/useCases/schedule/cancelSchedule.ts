import { CancelScheduleDTO } from "@application/dtos/schedule/cancelScheduleDto";
import { ApplicationError } from "@application/errors/applicationError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { ScheduleNotFoundError } from "@application/errors/schedule/scheduleNotFoundError";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { ScheduleResult } from "@domain/repositories/results/scheduleResult";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";

export class CancelSchedule {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly scheduleSlotRepository: IScheduleSlotRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: CancelScheduleDTO): Promise<Result<void, ApplicationError>> {
    const scheduleResult = await this.scheduleRepository.findById(dto.id);

    if (!scheduleResult) {
      return Result.fail(new ScheduleNotFoundError(dto.id));
    }

    const pedagogue = await this.pedagogueRepository.findById(scheduleResult.pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }

    const scheduleEntityValidation = this.generateScheduleEntity(scheduleResult, dto.reason);
    if (scheduleEntityValidation.isFailure) {
      return Result.fail(scheduleEntityValidation.error!);
    }

    const scheduleEntity = scheduleEntityValidation.getValue();

    await this.scheduleRepository.update(scheduleEntity);
    await this.scheduleSlotRepository.releaseSlotsByScheduleId(dto.id);

    const studentName = scheduleResult.studentName ?? scheduleResult.guestName;
    const studentEmail = scheduleResult.studentEmail ?? scheduleResult.guestEmail;

    await this.sendStudentEmail(
      studentEmail,
      studentName,
      pedagogue.name,
      scheduleEntity.startDate.value,
      scheduleEntity.endDate.value,
      dto.reason,
    );

    return Result.ok();
  }

  private generateScheduleEntity(scheduleResult: ScheduleResult, reason?: string): Result<Schedule> {
    const schedule = Schedule.rehydrate({
      ...scheduleResult,
      status: ScheduleStatusEnum.CANCELED_BY_PEDAGOGUE,
      reason: reason,
    });

    return Result.ok(schedule);
  }

  private async sendStudentEmail(
    email: string,
    name: string,
    pedagogueName: string,
    startDate: Date,
    endDate: Date,
    reason?: string,
  ) {
    await this.emailService.sendScheduleCancelledStudentEmail(email, {
      name: name,
      pedagogue: pedagogueName,
      date: startDate.toLocaleDateString("pt-BR"),
      startTime: formatTime(startDate),
      endTime: formatTime(endDate),
      reason: reason ?? "Não informado",
    });
  }
}
