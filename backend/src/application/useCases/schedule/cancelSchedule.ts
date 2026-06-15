import { CancelScheduleDTO } from "@application/dtos/schedule/cancelScheduleDto";
import { ApplicationError } from "@application/errors/applicationError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { ScheduleNotFoundError } from "@application/errors/schedule/scheduleNotFoundError";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
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

    const schedule = Schedule.rehydrate({
      ...scheduleResult,
      status: ScheduleStatusEnum.CANCELED_BY_PEDAGOGUE,
      reason: dto.reason || scheduleResult.reason,
    });

    await this.scheduleRepository.update(schedule);
    await this.scheduleSlotRepository.releaseSlotsByScheduleId(dto.id);

    // Email Data
    let studentName = scheduleResult.guestName || "Estudante";
    let studentEmail = scheduleResult.guestEmail;

    if (scheduleResult.studentId) {
      const student = await this.studentRepository.findByUUID(scheduleResult.studentId);
      if (student) {
        studentName = student.name;
        studentEmail = student.email;
      }
    }

    if (studentEmail) {
      await this.emailService.sendScheduleCancelledStudentEmail(studentEmail, {
        name: studentName,
        pedagogue: pedagogue.name,
        date: scheduleResult.startDate.toLocaleDateString("pt-BR"),
        startTime: formatTime(scheduleResult.startDate),
        endTime: formatTime(scheduleResult.endDate),
        reason: dto.reason || "Não informado",
      });
    }

    return Result.ok();
  }
}
