import { CancelScheduleByTokenDTO } from "@application/dtos/schedule/cancelScheduleByTokenDto";
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

export class CancelScheduleByToken {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly scheduleSlotRepository: IScheduleSlotRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: CancelScheduleByTokenDTO): Promise<Result<void, ApplicationError>> {
    const scheduleResult = await this.scheduleRepository.findByToken(dto.token);

    if (!scheduleResult) {
      return Result.fail(new ScheduleNotFoundError(dto.token));
    }

    const pedagogue = await this.pedagogueRepository.findById(scheduleResult.pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }

    const schedule = Schedule.rehydrate({
      ...scheduleResult,
      status: ScheduleStatusEnum.CANCELED_BY_STUDENT,
      reason: dto.reason || scheduleResult.reason,
    });

    await this.scheduleRepository.update(schedule);
    await this.scheduleSlotRepository.releaseSlotsByScheduleId(scheduleResult.id);

    // Email Data
    let studentName = scheduleResult.guestName || "Estudante";
    let studentEmail = scheduleResult.guestEmail;
    let studentEnrollment = "Convidado";
    let courseName = "Não informado";

    if (scheduleResult.studentId) {
      const student = await this.studentRepository.findByUUID(scheduleResult.studentId);
      if (student) {
        studentName = student.name;
        studentEmail = student.email;
        studentEnrollment = student.enrollmentId;
        courseName = student.course.name;
      }
    }

    const dateStr = scheduleResult.startDate.toLocaleDateString("pt-BR");
    const startTimeStr = formatTime(scheduleResult.startDate);
    const endTimeStr = formatTime(scheduleResult.endDate);
    const reasonStr = dto.reason || "Não informado";

    if (studentEmail) {
      await this.emailService.sendScheduleCancelledStudentEmail(studentEmail, {
        name: studentName,
        pedagogue: pedagogue.name,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        reason: reasonStr,
      });
    }

    await this.emailService.sendScheduleCancelledPedagogueEmail(pedagogue.email, {
      pedagogueName: pedagogue.name,
      studentName,
      enrollment: studentEnrollment,
      course: courseName,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      reason: reasonStr,
    });

    return Result.ok();
  }
}
