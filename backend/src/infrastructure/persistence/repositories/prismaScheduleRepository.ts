import { Schedule } from "@domain/entities/schedule";
import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { ScheduleListParams } from "@domain/repositories/filters/scheduleFilters";
import { PaginatedScheduleResult, ScheduleResult } from "@domain/repositories/results/scheduleResult";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { findValueInEnum } from "@domain/utils/enumUtils";
import { Prisma, PrismaClient, ScheduleStatus } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ScheduleResult | null> {
    const raw = await this.prisma.schedule.findUnique({
      where: { externalId: id },
      include: { pedagogue: true, student: { include: { course: true } } },
    });

    if (!raw) return null;

    return {
      id: raw.externalId,
      pedagogueId: raw.pedagogue.externalId,
      studentId: raw.student?.externalId ?? "",
      studentName: raw.student?.name ?? raw.guestName!,
      studentEmail: raw.student?.email ?? raw.guestEmail!,
      studentEnrollment: raw.student?.enrollmentId ?? "",
      studentCourse: raw.student?.course?.name ?? "",
      startDate: raw.startDate,
      endDate: raw.endDate,
      status: findValueInEnum(ScheduleStatusEnum, raw.status),
      reason: raw.reason ?? "",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  async findByPedagogueId(pedagogueId: string): Promise<ScheduleResult[]> {
    const results = await this.prisma.schedule.findMany({
      where: {
        pedagogue: { externalId: pedagogueId },
        removed: false,
      },
      include: { pedagogue: true, student: { include: { course: true } } },
    });

    const resultsMapped: ScheduleResult[] = results.map((raw) => ({
      id: raw.externalId,
      pedagogueId: raw.pedagogue.externalId,
      studentId: raw.student?.externalId ?? "",
      studentName: raw.student?.name ?? raw.guestName!,
      studentEmail: raw.student?.email ?? raw.guestEmail!,
      studentEnrollment: raw.student?.enrollmentId ?? "",
      studentCourse: raw.student?.course?.name ?? "",
      startDate: raw.startDate,
      endDate: raw.endDate,
      status: findValueInEnum(ScheduleStatusEnum, raw.status),
      reason: raw.reason ?? "",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }));

    return resultsMapped;
  }

  async findAll(params: ScheduleListParams): Promise<PaginatedScheduleResult> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const pedagogue = filters.pedagogueId
      ? await this.prisma.pedagogue.findUnique({
          where: { externalId: filters.pedagogueId, removed: false },
          select: { internalId: true },
        })
      : null;

    const where: Prisma.ScheduleWhereInput = {
      removed: false,
      ...(pedagogue && { pedagogueId: pedagogue.internalId }),
      ...(filters.status && { status: filters.status as ScheduleStatus }),
      ...(filters.date && {
        startDate: {
          gte: new Date(new Date(filters.date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(filters.date).setHours(23, 59, 59, 999)),
        },
      }),
      ...(filters.startDate && { startDate: { gte: filters.startDate } }),
      ...(filters.endDate && { endDate: { lte: filters.endDate } }),
      ...(filters.studentName && {
        OR: [
          { student: { name: { contains: filters.studentName, mode: "insensitive" } } },
          { guestName: { contains: filters.studentName, mode: "insensitive" } },
        ],
      }),
      ...(filters.studentEmail && {
        OR: [
          { student: { email: { contains: filters.studentEmail, mode: "insensitive" } } },
          { guestEmail: { contains: filters.studentEmail, mode: "insensitive" } },
        ],
      }),
      ...((filters.studentEnrollment || filters.studentCourse) && {
        student: {
          ...(filters.studentEnrollment && {
            enrollmentId: { contains: filters.studentEnrollment, mode: "insensitive" },
          }),
          ...(filters.studentCourse && {
            course: {
              OR: [
                { name: { contains: filters.studentCourse, mode: "insensitive" } },
                { acronym: { contains: filters.studentCourse, mode: "insensitive" } },
              ],
            },
          }),
        },
      }),
    };

    const [totalItems, results] = await Promise.all([
      this.prisma.schedule.count({ where }),
      this.prisma.schedule.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { startDate: "desc" },
        include: {
          pedagogue: { select: { externalId: true } },
          student: {
            include: { course: true },
          },
        },
      }),
    ]);

    const items: ScheduleResult[] = results.map((raw) => ({
      id: raw.externalId,
      pedagogueId: raw.pedagogue.externalId,
      studentId: raw.student?.externalId ?? "",
      studentName: raw.student?.name ?? raw.guestName!,
      studentEmail: raw.student?.email ?? raw.guestEmail!,
      studentEnrollment: raw.student?.enrollmentId ?? "",
      studentCourse: raw.student?.course?.name ?? "",
      startDate: raw.startDate,
      endDate: raw.endDate,
      status: findValueInEnum(ScheduleStatusEnum, raw.status),
      reason: raw.reason ?? "",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

  async save(schedule: Schedule): Promise<void> {
    const data: Prisma.ScheduleCreateInput = {
      externalId: schedule.id.value,
      pedagogue: { connect: { externalId: schedule.pedagogueId.value } },
      startDate: schedule.startDate.value,
      endDate: schedule.endDate.value,
      removed: schedule.removed,
      token: schedule.token.value,
      status: schedule.status.value as ScheduleStatus,
      reason: schedule.reason?.value ?? null,
      guestName: schedule.guestName?.value ?? null,
      guestEmail: schedule.guestEmail?.value ?? null,
    };

    if (schedule.studentId?.value) {
      data.student = { connect: { externalId: schedule.studentId.value } };
    }

    await this.prisma.schedule.create({
      data: data,
    });
  }

  async update(schedule: Schedule): Promise<void> {
    const data: Prisma.ScheduleUpdateInput = {
      startDate: schedule.startDate.value,
      endDate: schedule.endDate.value,
      removed: schedule.removed,
      token: schedule.token.value,
      status: schedule.status.value as ScheduleStatus,
      reason: schedule.reason?.value ?? null,
      guestName: schedule.guestName?.value ?? null,
      guestEmail: schedule.guestEmail?.value ?? null,
    };

    if (schedule.studentId?.value) {
      data.student = { connect: { externalId: schedule.studentId.value } };
    }

    await this.prisma.schedule.update({
      where: { externalId: schedule.id.value },
      data: data,
    });
  }
}
