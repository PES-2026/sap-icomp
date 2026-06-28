import { ApplicationError } from "@application/errors/applicationError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { EmailToPedagogueNotSendError } from "@application/errors/schedule/emailToPedagogueNotSendError";
import { EmailToStudentNotSendError } from "@application/errors/schedule/emailToStudentNotSendError";
import { NoAvailableSlotsError } from "@application/errors/schedule/noAvailableSlotsError";
import { RequestedScheduleUncoveredError } from "@application/errors/schedule/requestScheduleUncoveredError";
import { RetroactiveDateError } from "@application/errors/schedule/retroactiveDateError";
import { SlotNotAvailableForScheduleError } from "@application/errors/schedule/slotNotAvailableForScheduleError";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { DomainError } from "@domain/errors/domainError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { CourseItem } from "@domain/repositories/results/courseResult";
import { PedagogueResult } from "@domain/repositories/results/pedagogueResult";
import { ScheduleSlotResult } from "@domain/repositories/results/scheduleSlotResult";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";

import { RequestScheduleDTO, RequestAttendanceResponse } from "../../dtos/schedule/requestScheduleDto";

export class RequestSchedule {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private pedagogueRepository: IPedagogueRepository,
    private studentRepository: IStudentRepository,
    private scheduleSlotRepository: IScheduleSlotRepository,
    private courseRepository: ICourseRepository,
    private emailService: IEmailService,
  ) {}

  async execute(dto: RequestScheduleDTO): Promise<Result<RequestAttendanceResponse, ApplicationError>> {
    const availableSlotValidation = await this.getAvailableSlot(dto.slotId);
    if (availableSlotValidation?.isFailure) {
      return Result.fail(availableSlotValidation.error!);
    }

    const slot = availableSlotValidation.getValue();
    const retroactiveDateResult = this.validateRetroactiveDate(slot);

    if (retroactiveDateResult.isFailure) {
      return Result.fail(retroactiveDateResult.error!);
    }

    const pedagogueResult = await this.getPedagogue(dto.pedagogueId);
    if (pedagogueResult.isFailure) {
      return Result.fail(pedagogueResult.error!);
    }
    const pedagogue = pedagogueResult.getValue();

    const uncoveredScheduleValidation = this.validateUncoveredSlot(
      dto.pedagogueId,
      slot.startDateTime,
      slot.endDateTime,
      slot,
    );
    if (uncoveredScheduleValidation.isFailure) {
      return Result.fail(uncoveredScheduleValidation.error!);
    }

    const scheduleEntityValidation = await this.createScheduleEntity(dto, slot.startDateTime, slot.endDateTime);
    if (scheduleEntityValidation.isFailure) {
      return Result.fail(scheduleEntityValidation.error!);
    }

    const scheduleEntity = scheduleEntityValidation.getValue();

    await this.scheduleRepository.save(scheduleEntity);

    await this.scheduleSlotRepository.updateStatusUnique(
      slot.id,
      ScheduleSlotStatusEnum.PENDING,
      scheduleEntity.id.value,
    );

    const courseValidation = await this.getCourse(dto.courseId);
    if (courseValidation.isFailure) {
      return Result.fail(courseValidation.error!);
    }

    const courseName = courseValidation.getValue().name;
    const studentName = dto.name;

    await this.sendStudentEmail(
      dto.email,
      studentName,
      pedagogue.name,
      slot.startDateTime,
      slot.endDateTime,
      dto.durationMinutes,
      courseName,
      scheduleEntity.token.value,
      dto.reason ?? undefined,
    );

    await this.sendPedagogueEmail(
      pedagogue.email,
      pedagogue.name,
      studentName,
      courseName,
      dto.email,
      slot.startDateTime,
      slot.endDateTime,
      dto.durationMinutes,
      dto.reason ?? undefined,
    );

    return Result.ok({
      scheduleId: scheduleEntity.id.value,
      message: "The schedule was successfully requested and is pending approval from the pedagogue.",
    });
  }

  private validateRetroactiveDate(slot: ScheduleSlotResult): Result<void, RetroactiveDateError> {
    const now = new Date();
    if (slot.startDateTime < now) {
      return Result.fail(new RetroactiveDateError());
    }
    return Result.ok();
  }

  private async getPedagogue(pedagogueId: string): Promise<Result<PedagogueResult, PedagogueNotFoundError>> {
    const pedagogue = await this.pedagogueRepository.findById(pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }
    return Result.ok<PedagogueResult>(pedagogue);
  }

  private async getAvailableSlot(slotId: string): Promise<Result<ScheduleSlotResult>> {
    const availableSlot = await this.scheduleSlotRepository.findById(slotId);

    if (!availableSlot) {
      return Result.fail(new NoAvailableSlotsError(slotId));
    }
    if (availableSlot.status !== ScheduleSlotStatusEnum.CREATED) {
      return Result.fail(new SlotNotAvailableForScheduleError(slotId));
    }
    return Result.ok(availableSlot);
  }

  private validateUncoveredSlot(
    pedagogueId: string,
    startTime: Date,
    endDate: Date,
    availableSlot: ScheduleSlotResult,
  ): Result<void, RequestedScheduleUncoveredError> {
    const totalDurationMs = endDate.getTime() - startTime.getTime();
    let slotsDurationMs = 0;

    slotsDurationMs += availableSlot.endDateTime.getTime() - availableSlot.startDateTime.getTime();

    if (slotsDurationMs < totalDurationMs) {
      return Result.fail(
        new RequestedScheduleUncoveredError(
          pedagogueId,
          startTime.toISOString(),
          endDate.toISOString(),
          startTime.toDateString(),
        ),
      );
    }
    return Result.ok();
  }

  private async createScheduleEntity(
    dto: RequestScheduleDTO,
    startTime: Date,
    endDate: Date,
  ): Promise<Result<Schedule, DomainError>> {
    const student = await this.studentRepository.findByEmail(dto.email);

    const scheduleEntityResult = Schedule.create({
      pedagogueId: dto.pedagogueId,
      studentId: student?.id,
      guestName: !student ? dto.name : undefined,
      guestEmail: !student ? dto.email : undefined,
      startDate: startTime,
      endDate: endDate,
      status: ScheduleStatusEnum.PENDING,
      reason: dto.reason ?? undefined,
    });

    if (scheduleEntityResult.isFailure) {
      return Result.fail(scheduleEntityResult.error!);
    }

    return Result.ok(scheduleEntityResult.getValue());
  }

  private async getCourse(courseId: string): Promise<Result<CourseItem>> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      return Result.fail(new CourseNotFoundError(courseId));
    }

    return Result.ok(course);
  }

  private async sendStudentEmail(
    email: string,
    studentName: string,
    pedagogueName: string,
    startTime: Date,
    endDate: Date,
    durationMinutes: number,
    courseName: string,
    token: string,
    reason?: string | undefined,
  ) {
    try {
      await this.emailService.sendScheduleRequestedStudentEmail(email, {
        name: studentName,
        pedagogue: pedagogueName,
        date: startTime.toLocaleDateString(),
        startTime: startTime.toLocaleTimeString(),
        endTime: endDate.toLocaleTimeString(),
        duration: `${durationMinutes} minutos`,
        course: courseName,
        token: token,
        reason: reason ?? "Não informada",
      });
    } catch (error) {
      console.error(`An error occurred to send the email to the student: ${error}`);
      return Result.fail(new EmailToStudentNotSendError());
    }
  }

  private async sendPedagogueEmail(
    email: string,
    pedagogueName: string,
    studentName: string,
    courseName: string,
    studentEmail: string,
    startTime: Date,
    endDate: Date,
    durationMinutes: number,
    reason?: string | undefined,
  ) {
    try {
      await this.emailService.sendScheduleRequestedPedagogueEmail(email, {
        pedagogueName: pedagogueName,
        studentName: studentName,
        course: courseName,
        email: studentEmail,
        date: startTime.toLocaleDateString(),
        startTime: startTime.toLocaleTimeString(),
        endTime: endDate.toLocaleTimeString(),
        duration: `${durationMinutes} minutos`,
        reason: reason ?? "Não informada",
      });
      return Result.ok();
    } catch (error) {
      console.error(`An error occurred to send the email to the pedagogue: ${error}`);
      return Result.fail(new EmailToPedagogueNotSendError());
    }
  }
}
