import { RescheduleScheduleByTokenDTO } from "@application/dtos/schedule/rescheduleScheduleByTokenDto";
import { ApplicationError } from "@application/errors/applicationError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { NoAvailableSlotsError } from "@application/errors/schedule/noAvailableSlotsError";
import { ScheduleNotFoundError } from "@application/errors/schedule/scheduleNotFoundError";
import { SlotNotAvailableForScheduleError } from "@application/errors/schedule/slotNotAvailableForScheduleError";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";

export class RescheduleScheduleByToken {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly scheduleSlotRepository: IScheduleSlotRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly emailService: IEmailService,
    private readonly frontendUrl: string,
  ) {}

  async execute(dto: RescheduleScheduleByTokenDTO): Promise<Result<void, ApplicationError>> {
    const scheduleResult = await this.scheduleRepository.findByToken(dto.token);

    if (!scheduleResult) {
      return Result.fail(new ScheduleNotFoundError(dto.token));
    }

    const pedagogue = await this.pedagogueRepository.findById(scheduleResult.pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }

    const newSlot = await this.scheduleSlotRepository.findById(dto.newSlotId);
    if (!newSlot) {
      return Result.fail(new NoAvailableSlotsError(dto.newSlotId));
    }

    if (newSlot.status !== ScheduleSlotStatusEnum.CREATED) {
      return Result.fail(new SlotNotAvailableForScheduleError(dto.newSlotId));
    }

    // Capture previous data for email
    const previousDate = scheduleResult.startDate.toLocaleDateString("pt-BR");
    const previousStartTime = formatTime(scheduleResult.startDate);
    const previousEndTime = formatTime(scheduleResult.endDate);

    // Release old slots
    await this.scheduleSlotRepository.releaseSlotsByScheduleId(scheduleResult.id);

    // Update schedule
    const schedule = Schedule.rehydrate({
      ...scheduleResult,
      startDate: newSlot.startDateTime,
      endDate: newSlot.endDateTime,
      status: ScheduleStatusEnum.PENDING, // Goes back to pending after reschedule
      reason: dto.reason || scheduleResult.reason,
    });

    await this.scheduleRepository.update(schedule);

    // Book new slot
    await this.scheduleSlotRepository.updateStatusUnique(
      newSlot.id,
      ScheduleSlotStatusEnum.PENDING,
      schedule.id.value,
    );

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

    if (studentEmail) {
      const durationMs = newSlot.endDateTime.getTime() - newSlot.startDateTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);

      // To Student
      await this.emailService.sendRescheduledStudentEmail(studentEmail, {
        name: studentName,
        pedagogue: pedagogue.name,
        previousDate,
        previousStartTime,
        previousEndTime,
        newDate: newSlot.startDateTime.toLocaleDateString("pt-BR"),
        newStartTime: formatTime(newSlot.startDateTime),
        newEndTime: formatTime(newSlot.endDateTime),
        duration: `${durationMinutes} min`,
        course: courseName,
        reason: dto.reason || scheduleResult.reason || "Não informado",
        token: schedule.token.value,
      });

      // To Pedagogue
      await this.emailService.sendRescheduledPedagogueEmail(pedagogue.email, {
        pedagogueName: pedagogue.name,
        studentName,
        enrollment: studentEnrollment,
        course: courseName,
        previousDate,
        previousStartTime,
        previousEndTime,
        newDate: newSlot.startDateTime.toLocaleDateString("pt-BR"),
        newStartTime: formatTime(newSlot.startDateTime),
        newEndTime: formatTime(newSlot.endDateTime),
        duration: `${durationMinutes} min`,
        reason: dto.reason || scheduleResult.reason || "Não informado",
      });
    }

    return Result.ok();
  }
}
