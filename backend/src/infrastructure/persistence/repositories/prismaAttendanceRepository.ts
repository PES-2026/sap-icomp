import { Attendance } from "@domain/entities/attendance";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { AttendanceListParams } from "@domain/repositories/filters/attendanceFilters";
import {
  AttendanceResult,
  FindByStudentParams,
  PaginatedAttendanceResult,
} from "@domain/repositories/results/attendanceResult";
import { PrismaClient, Prisma } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaAttendanceRepository implements IAttendanceRepository {
  constructor(private prisma: PrismaClient) {}

  async save(attendance: Attendance): Promise<void> {
    await this.prisma.attendance.create({
      data: {
        externalId: attendance.id.value,
        studentId: attendance.studentId.value,
        date: attendance.date.value,
        type: attendance.type.value,
        demand: attendance.demand.value,
        generalObservations: attendance.generalObservations?.value ?? "",
      },
    });
  }

  async findAll(params: AttendanceListParams): Promise<PaginatedAttendanceResult> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {
      removed: false,
      ...(filters.studentName && {
        student: {
          name: { contains: filters.studentName, mode: "insensitive" },
        },
      }),
      ...(filters.studentCourse && {
        student: {
          course: {
            name: { contains: filters.studentCourse, mode: "insensitive" },
          },
        },
      }),
      ...(filters.studentEnrollment && {
        student: {
          enrollmentId: { contains: filters.studentEnrollment },
        },
      }),
      ...(filters.attendanceType && { type: filters.attendanceType }),
      ...(filters.startDate &&
        filters.endDate && {
          date: {
            ...(filters.startDate && { gte: filters.startDate }),
            ...(filters.endDate && { lte: filters.endDate }),
          },
        }),
    };

    const [totalItems, results] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { date: "desc" },
        include: { student: { include: { course: true } } },
      }),
    ]);

    const items: AttendanceResult[] = results.map((result) => ({
      id: result.externalId,
      studentId: result.studentId,
      date: result.date,
      type: result.type,
      demand: result.demand,
      generalObservations: result.generalObservations,
      updatedAt: result.updatedAt,
      createdAt: result.createdAt,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

  async findById(id: string): Promise<AttendanceResult | null> {
    const attendance = await this.prisma.attendance.findFirst({
      where: { externalId: id, removed: false },
    });

    if (!attendance) return null;

    return {
      id: attendance.externalId,
      studentId: attendance.studentId,
      date: attendance.date,
      type: attendance.type,
      demand: attendance.demand,
      generalObservations: attendance.generalObservations,
      updatedAt: attendance.updatedAt,
      createdAt: attendance.createdAt,
    };
  }

  async update(attendance: Attendance): Promise<void> {
    await this.prisma.attendance.update({
      where: { externalId: attendance.id.value },
      data: {
        type: attendance.type.value,
        date: attendance.date.value,
        demand: attendance.demand.value,
        generalObservations: attendance.generalObservations?.value ?? "",
      },
    });
  }

  async findByStudentId(params: FindByStudentParams): Promise<PaginatedAttendanceResult> {
    const { page, limit, studentId } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {
      student: {
        externalId: studentId,
      },
      removed: false,
    };

    const [totalItems, results] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { date: "desc" },
        include: { student: { include: { course: true } } },
      }),
    ]);

    const items: AttendanceResult[] = results.map((result) => ({
      id: result.externalId,
      studentId: result.studentId,
      date: result.date,
      type: result.type,
      demand: result.demand,
      generalObservations: result.generalObservations,
      updatedAt: result.updatedAt,
      createdAt: result.createdAt,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.attendance.update({
      where: { externalId: id },
      data: { removed: true },
    });
  }
}
