import { ApplicationError } from "@application/errors/applicationError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { MaxAttendanceTimeExceededError } from "@application/errors/schedule/maxAttendanceTimeExceededError";
import { MaxAttendanceTimeNotDefinedError } from "@application/errors/schedule/maxAttendanceTimeNotDefinedError";
import { RetroactiveDateError } from "@application/errors/schedule/retroactiveDateError";
import { Schedule } from "@domain/entities/schedule";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { CourseItem } from "@domain/repositories/results/courseResult";
import { PedagogueResult } from "@domain/repositories/results/pedagogueResult";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";

import { RequestScheduleDTO, RequestAttendanceResponse } from "../../dtos/schedule/requestScheduleDto";

export class RequestSchedule {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private pedagogueRepository: IPedagogueRepository,
    private courseRepository: ICourseRepository,
    private emailService: IEmailService,
  ) {}

  async execute(dto: RequestScheduleDTO): Promise<Result<RequestAttendanceResponse, ApplicationError>> {
    const retroactiveDateResult = this.validateRetroactiveDate(dto.startTime);

    if (retroactiveDateResult.isFailure) {
      return Result.fail(retroactiveDateResult.error!);
    }

    const pedagogue = await this.getPedagogue(dto.pedagogueId);

    if (pedagogue.isFailure) {
      return Result.fail(pedagogue.error!);
    }

    const schedulingConflictResult = await this.validateSchedulingConflict(pedagogue.getValue(), dto.durationMinutes);

    if (schedulingConflictResult.isFailure) {
      return Result.fail(schedulingConflictResult.error!);
    }

    const course = await this.getCourse(dto.courseId);
    if (course.isFailure) {
      return Result.fail(course.error!);
    }

    const endDate = this.calculateEndTime(dto.startTime, dto.durationMinutes);

    // It's necessary to adapt to the logical of the schedule slots, I'll to it since the implementation is concluded
    // const availableSlotsResult = await this.validateAvailableSlots(
    //   dto.startTime,
    //   dto.durationMinutes,
    //   dto.pedagogueId,
    // );

    // if (availableSlotsResult.isFailure) {
    //   return Result.fail(availableSlotsResult.error!);
    // }

    // try {
    //   await this.scheduleSlotRepository.updateStatusMany(
    //     availableSlots.map((s) => s.id.value),
    //     ScheduleSlotStatusEnum.PENDING,
    //     attendance.id.value,
    //   );
    // } catch (error: any) {
    //   return Result.fail(new ScheduleConflictError());
    // }

    const scheduleEntity = Schedule.create({
      pedagogueId: dto.pedagogueId,
      startDate: dto.startTime,
      endDate: endDate,
    });

    await this.scheduleRepository.save(scheduleEntity.getValue());

    await this.emailService.sendScheduleRequestedStudentEmail(dto.email, {
      name: dto.name,
      pedagogue: pedagogue.getValue().name,
      date: dto.startTime.toLocaleDateString(),
      startTime: dto.startTime.toLocaleTimeString(),
      endTime: endDate.toLocaleTimeString(),
      duration: `${dto.durationMinutes} minutos`,
      course: course.getValue().name,
      reason: dto.reason ?? "Não informada",
    });
    await this.emailService.sendScheduleRequestedPedagogueEmail(pedagogue.getValue().email, {
      pedagogueName: pedagogue.getValue().name,
      studentName: dto.name,
      course: course.getValue().name,
      email: dto.email,
      date: dto.startTime.toLocaleDateString(),
      startTime: dto.startTime.toLocaleTimeString(),
      endTime: endDate.toLocaleTimeString(),
      duration: `${dto.durationMinutes} minutos`,
      reason: dto.reason ?? "Não informada",
      dashboardLink: "https://example.com/dashboard", // Verify when implemented the dashboard route and adapt this link
    });

    return Result.ok({
      scheduleId: scheduleEntity.getValue().id.value,
      message: "The schedule was successfully requested and is pending approval from the pedagogue.",
    });
  }

  private validateRetroactiveDate(startTime: Date): Result<void, RetroactiveDateError> {
    const now = new Date();
    if (startTime < now) {
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

  private async validateSchedulingConflict(
    pedagogue: PedagogueResult,
    durationMinutes: number,
  ): Promise<Result<void, MaxAttendanceTimeExceededError | MaxAttendanceTimeNotDefinedError>> {
    if (pedagogue.maxAttendanceTime === undefined) {
      return Result.fail(new MaxAttendanceTimeNotDefinedError());
    }
    if (durationMinutes > pedagogue.maxAttendanceTime) {
      return Result.fail(new MaxAttendanceTimeExceededError(pedagogue.maxAttendanceTime));
    }
    return Result.ok();
  }

  private async getCourse(courseId: string): Promise<Result<CourseItem, CourseNotFoundError>> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      return Result.fail(new CourseNotFoundError(courseId));
    }
    return Result.ok<CourseItem>(course);
  }

  // It's necessary to adapt to the logical of the schedule slots, I'll to it since the implementation is concluded
  // private async validateAvailableSlots(
  //   startTime: Date,
  //   durationMinutes: number,
  //   pedagogueId: string,
  // ): Promise<Result<void, ScheduleConflictError>> {
  //   const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  //   const availableSlots = await this.scheduleSlotRepository.findAvailableInInterval(pedagogueId, startTime, endTime);

  //   if (availableSlots.length === 0) {
  //     return Result.fail(new ScheduleConflictError());
  //   }

  //   const firstSlot = availableSlots[0];
  //   const lastSlot = availableSlots[availableSlots.length - 1];

  //   if (!firstSlot || !lastSlot || firstSlot.startDateTime.value > startTime || lastSlot.endDateTime.value < endTime) {
  //     return Result.fail(new ScheduleConflictError());
  //   }

  //   return Result.ok();
  // }

  private calculateEndTime(startTime: Date, durationMinutes: number): Date {
    return new Date(startTime.getTime() + durationMinutes * 60000);
  }
}
