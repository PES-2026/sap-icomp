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
    const pedagogue = await this.prisma.pedagogue.findFirst();

    await this.prisma.attendance.create({
      data: {
        externalId: attendance.id.value,
        student: { connect: { externalId: attendance.studentId.value } },
        ...(pedagogue && { pedagogue: { connect: { internalId: pedagogue.internalId } } }),
        type: { connect: { externalid: attendance.typeId.value } },
        attendedAt: attendance.date.value,
        demand: attendance.demand.value,
        observation: attendance.generalObservations?.value ?? "",
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
      ...(filters.attendanceType && {
        type: {
          name: { equals: filters.attendanceType },
        },
      }),
      ...(filters.startDate &&
        filters.endDate && {
          attendedAt: {
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
        orderBy: { attendedAt: "desc" },
        include: {
          student: { include: { course: true } },
          type: true,
        },
      }),
    ]);

    const items: AttendanceResult[] = results.map((result) => ({
      id: result.externalId,
      studentId: result.student.externalId,
      date: result.attendedAt,
      typeId: result.type.externalid,
      demand: result.demand ?? "",
      generalObservations: result.observation ?? "",
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
      include: {
        student: true,
        type: true,
      },
    });

    if (!attendance) return null;

    return {
      id: attendance.externalId,
      studentId: attendance.student.externalId,
      date: attendance.attendedAt,
      typeId: attendance.type.externalid,
      demand: attendance.demand ?? "",
      generalObservations: attendance.observation ?? "",
      updatedAt: attendance.updatedAt,
      createdAt: attendance.createdAt,
    };
  }

  async update(attendance: Attendance): Promise<void> {
    const attendanceType = await this.prisma.attendanceType.findUnique({
      where: { externalid: attendance.typeId.value },
    });

    if (!attendanceType) throw new Error(`Attendance type ID ${attendance.typeId.value} not found`);

    await this.prisma.attendance.update({
      where: { externalId: attendance.id.value },
      data: {
        typeId: attendanceType.internalId,
        attendedAt: attendance.date.value,
        demand: attendance.demand.value,
        observation: attendance.generalObservations?.value ?? "",
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
        orderBy: { attendedAt: "desc" },
        include: {
          student: { include: { course: true } },
          type: true,
        },
      }),
    ]);

    const items: AttendanceResult[] = results.map((result) => ({
      id: result.externalId,
      studentId: result.student.externalId,
      date: result.attendedAt,
      typeId: result.type.externalid,
      demand: result.demand ?? "",
      generalObservations: result.observation ?? "",
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

  async existsTypeById(id: string): Promise<boolean> {
    const type = await this.prisma.attendanceType.findUnique({
      where: { externalid: id },
      select: { internalId: true },
    });
    return !!type;
  }

  async existsAnyPedagogue(): Promise<boolean> {
    const pedagogue = await this.prisma.pedagogue.findFirst({
      select: { internalId: true },
    });
    return !!pedagogue;
  }
}
