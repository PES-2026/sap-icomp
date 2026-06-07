import crypto from "crypto";

import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { MaxAttendanceTimeExceededError } from "@application/errors/schedule/maxAttendanceTimeExceededError";
import { RetroactiveDateError } from "@application/errors/schedule/retroactiveDateError";
import { ScheduleConflictError } from "@application/errors/schedule/scheduleConflictError";
import { Attendance } from "@domain/entities/attendance";
import { Student } from "@domain/entities/student";
import { AttendanceStatusEnum } from "@domain/enum/attendanceStatus";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";

import { RequestScheduleDTO, RequestAttendanceResponse } from "../../dtos/schedule/requestAttendanceDto";

export class RequestAttendance {
  constructor(
    private attendanceRepository: IAttendanceRepository,
    private studentRepository: IStudentRepository,
    private pedagogueRepository: IPedagogueRepository,
    private scheduleSlotRepository: IScheduleSlotRepository,
    private attendanceTypeRepository: IAttendanceTypeRepository,
    private courseRepository: ICourseRepository,
    private emailService: IEmailService,
  ) {}

  async execute(dto: RequestScheduleDTO): Promise<Result<RequestAttendanceResponse, ApplicationError | DomainError>> {
    const retroactiveDateResult = this.validateRetroactiveDate(dto.startTime);

    if (retroactiveDateResult.isFailure) {
      return Result.fail(retroactiveDateResult.error!);
    }

    const schedulingConflictResult = await this.validateSchedulingConflict(dto.pedagogueId, dto.durationMinutes);

    if (schedulingConflictResult.isFailure) {
      return Result.fail(schedulingConflictResult.error!);
    }

    const courseExists = await this.validateWheterCourseExists(dto.courseId);
    if (courseExists.isFailure) {
      return Result.fail(courseExists.error!);
    }

    const availableSlotsResult = await this.validateAvailableSlots(
      dto.startTime,
      dto.durationMinutes,
      dto.pedagogueId,
    );

    if (availableSlotsResult.isFailure) {
      return Result.fail(availableSlotsResult.error!);
    }

    // 5. Get or Create Student
    let studentId: string;
    const existingStudent = await this.studentRepository.findByEnrollmentId(dto.enrollmentId);

    if (existingStudent) {
      studentId = existingStudent.id;
    } else {
      const studentEntityResult = Student.create({
        name: dto.name,
        enrollmentId: dto.enrollmentId,
        dtBirth: dto.dtBirth,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        course: dto.courseId,
        diagnoses: [],
        potential: "",
        difficulties: "",
      });

      if (studentEntityResult.isFailure) {
        return Result.fail(studentEntityResult.error!);
      }

      const studentEntity = studentEntityResult.getValue();
      await this.studentRepository.save(studentEntity);
      studentId = studentEntity.studentId.value;
    }

    // 6. Create Attendance and Update Slots (Atomic/Transactional)
    const token = crypto.randomBytes(32).toString("hex");
    const attendanceResult = Attendance.create({
      studentId,
      pedagogueId: dto.pedagogueId,
      date: dto.startTime,
      typeId: dto.typeId,
      demand: dto.reason,
      status: AttendanceStatusEnum.PENDING,
      token,
    });

    if (attendanceResult.isFailure) {
      return Result.fail(attendanceResult.error!);
    }

    const attendance = attendanceResult.getValue();

    try {
      // Concurrency protection happens inside updateStatusMany (transaction)
      await this.scheduleSlotRepository.updateStatusMany(
        availableSlots.map((s) => s.id.value),
        ScheduleSlotStatusEnum.PENDING,
        attendance.id.value,
      );
    } catch (error: any) {
      return Result.fail(new ScheduleConflictError());
    }

    await this.attendanceRepository.save(attendance);

    // 7. Send Emails
    const studentLink = `https://sistema.icomp.ufam.edu.br/agendamento/gerenciar?token=${token}`;

    await this.emailService.sendEmail({
      to: dto.email,
      subject: "Solicitação de Agendamento Recebida",
      body: `Olá ${dto.name},\n\nSua solicitação de atendimento para o dia ${dto.startTime.toLocaleString()} foi recebida e está PENDENTE DE CONFIRMAÇÃO.\n\nResumo:\n- Pedagoga: ${pedagogue.name.value}\n- Motivo: ${dto.reason}\n\nVocê pode gerenciar seu agendamento através do link: ${studentLink}`,
    });

    await this.emailService.sendEmail({
      to: pedagogue.email.value,
      subject: "Nova Solicitação de Atendimento",
      body: `Olá ${pedagogue.name.value},\n\nUma nova solicitação de atendimento foi realizada:\n\n- Aluno: ${dto.name} (${dto.enrollmentId})\n- Data: ${dto.startTime.toLocaleString()}\n- Motivo: ${dto.reason}`,
    });

    return Result.ok({
      attendanceId: attendance.id.value,
      message: "Solicitação realizada com sucesso. Verifique seu e-mail para confirmação.",
    });
  }

  private validateRetroactiveDate(startTime: Date): Result<void, RetroactiveDateError> {
    const now = new Date();
    if (startTime < now) {
      return Result.fail(new RetroactiveDateError());
    }
    return Result.ok();
  }

  private async validateSchedulingConflict(
    pedagogueId: string,
    durationMinutes: number,
  ): Promise<Result<void, PedagogueNotFoundError | MaxAttendanceTimeExceededError>> {
    const pedagogue = await this.pedagogueRepository.findEntityById(pedagogueId);
    if (!pedagogue) {
      return Result.fail(new PedagogueNotFoundError());
    }

    if (durationMinutes > pedagogue.maxAttendanceTime) {
      return Result.fail(new MaxAttendanceTimeExceededError(pedagogue.maxAttendanceTime));
    }
    return Result.ok();
  }

  private async validateWheterCourseExists(courseId: string): Promise<Result<void, CourseNotFoundError>> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      return Result.fail(new CourseNotFoundError(courseId));
    }
    return Result.ok();
  }

  private async validateAvailableSlots(
    startTime: Date,
    durationMinutes: number,
    pedagogueId: string,
  ): Promise<Result<void, ScheduleConflictError>> {
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    const availableSlots = await this.scheduleSlotRepository.findAvailableInInterval(pedagogueId, startTime, endTime);

    if (availableSlots.length === 0) {
      return Result.fail(new ScheduleConflictError());
    }

    const firstSlot = availableSlots[0];
    const lastSlot = availableSlots[availableSlots.length - 1];

    if (!firstSlot || !lastSlot || firstSlot.startDateTime.value > startTime || lastSlot.endDateTime.value < endTime) {
      return Result.fail(new ScheduleConflictError());
    }

    return Result.ok();
  }
}
