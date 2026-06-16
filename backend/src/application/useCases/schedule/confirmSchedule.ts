import { ConfirmScheduleDTO } from "@application/dtos/schedule/confirmScheduleDto";
import { ApplicationError } from "@application/errors/applicationError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { ScheduleCancelledByPedagogueError } from "@application/errors/schedule/scheduleCancelledByPedagogueError";
import { ScheduleCancelledByStudentError } from "@application/errors/schedule/scheduleCancelledByStudentError";
import { ScheduleCompletedError } from "@application/errors/schedule/scheduleCompletedError";
import { ScheduleConfirmedError } from "@application/errors/schedule/scheduleConfirmedError";
import { ScheduleExpiredError } from "@application/errors/schedule/scheduleExpiredError";
import { ScheduleMissedError } from "@application/errors/schedule/scheduleMissedError";
import { ScheduleSlotNotFoundError } from "@application/errors/schedule/scheduleSlotNotFoundError";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";

export class ConfirmSchedule {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: ConfirmScheduleDTO): Promise<Result<void, ApplicationError>> {
    const scheduleResult = await this.scheduleRepository.findById(dto.id);

    if (!scheduleResult) {
      return Result.fail(new ScheduleSlotNotFoundError(dto.id));
    }

    const pedagogue = await this.pedagogueRepository.findById(scheduleResult.pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }

    let studentName = scheduleResult.studentName ?? scheduleResult.guestName;
    const statusValidation = this.validateScheduleStatus(
      scheduleResult.status,
      studentName,
      pedagogue.name,
      scheduleResult.id,
    );

    if (statusValidation.isFailure) {
      return Result.fail(statusValidation.error!);
    }

    const schedule = Schedule.rehydrate({
      ...scheduleResult,
      status: ScheduleStatusEnum.CONFIRMED,
    });

    await this.scheduleRepository.update(schedule);

    let studentEmail = scheduleResult.studentEmail ?? scheduleResult.guestEmail;
    let courseName = scheduleResult.studentEmail;

    if (scheduleResult.studentId) {
      const student = await this.studentRepository.findByUUID(scheduleResult.studentId);
      if (student) {
        studentName = student.name;
        studentEmail = student.email;
        courseName = student.course.name;
      }
    }

    if (studentEmail) {
      const durationMs = scheduleResult.endDate.getTime() - scheduleResult.startDate.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);

      await this.emailService.sendScheduleConfirmedStudentEmail(studentEmail, {
        studentName,
        pedagogueName: pedagogue.name,
        date: scheduleResult.startDate.toLocaleDateString("pt-BR"),
        startTime: formatTime(scheduleResult.startDate),
        endTime: formatTime(scheduleResult.endDate),
        duration: `${durationMinutes} min`,
        course: courseName,
        reason: scheduleResult.reason || "Não informado",
      });
    }

    return Result.ok();
  }

  private validateScheduleStatus(
    status: ScheduleStatusEnum,
    scheduleId: string,
    studentName: string,
    pedagogueName: string,
  ): Result<void, ApplicationError> {
    switch (status) {
      case ScheduleStatusEnum.CANCELED_BY_STUDENT:
        return Result.fail(new ScheduleCancelledByStudentError(scheduleId, studentName));
      case ScheduleStatusEnum.CANCELED_BY_PEDAGOGUE:
        return Result.fail(new ScheduleCancelledByPedagogueError(scheduleId, pedagogueName));
      case ScheduleStatusEnum.MISSED:
        return Result.fail(new ScheduleMissedError(scheduleId));
      case ScheduleStatusEnum.EXPIRED:
        return Result.fail(new ScheduleExpiredError(scheduleId));
      case ScheduleStatusEnum.COMPLETED:
        return Result.fail(new ScheduleCompletedError(scheduleId));
      case ScheduleStatusEnum.CONFIRMED:
        return Result.fail(new ScheduleConfirmedError(scheduleId));
      case ScheduleStatusEnum.PENDING:
        return Result.ok();
    }
  }
}
