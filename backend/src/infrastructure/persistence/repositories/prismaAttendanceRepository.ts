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
    const pedagogue = attendance.pedagogueId
      ? await this.prisma.pedagogue.findUnique({ where: { externalId: attendance.pedagogueId.value } })
      : await this.prisma.pedagogue.findFirst();

    await this.prisma.attendance.create({
      data: {
        externalId: attendance.id.value,
        student: { connect: { externalId: attendance.studentId.value } },
        ...(pedagogue && { pedagogue: { connect: { internalId: pedagogue.internalId } } }),
        type: { connect: { externalid: attendance.typeId.value } },
        attendedAt: attendance.date.value,
        demand: attendance.demand.value,
        observation: attendance.generalObservations?.value ?? "",
        status: attendance.status as any,
        token: attendance.token ?? null,
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
          student: {
            include: {
              course: { include: { coordinator: true } },
              diagnoses: { include: { diagnosis: true } },
              attendances: { orderBy: { attendedAt: "desc" }, take: 1 },
            },
          },
          type: true,
        },
      }),
    ]);

    const items: AttendanceResult[] = results.map((result) => ({
      id: result.externalId,
      student: {
        id: result.student.externalId,
        name: result.student.name,
        enrollmentId: result.student.enrollmentId,
        dtBirth: result.student.dtBirth,
        email: result.student.email,
        phoneNumber: result.student.phoneNumber,
        course: {
          id: result.student.course.externalId,
          name: result.student.course.name,
          acronym: result.student.course.acronym,
          coordinatorId: result.student.course.coordinator?.externalId ?? "",
          coordinatorName: result.student.course.coordinator?.name ?? "",
          createdAt: result.student.course.createdAt,
          updatedAt: result.student.course.updatedAt,
        },
        diagnoses: result.student.diagnoses.map((d) => ({
          id: d.diagnosis.externalId,
          name: d.diagnosis.name,
          acronym: d.diagnosis.acronym ?? "",
          cid: d.diagnosis.CID ?? "",
          createdAt: d.diagnosis.createdAt,
          updatedAt: d.diagnosis.updatedAt,
        })),
        potential: result.student.potential ?? "",
        difficulties: result.student.difficulties ?? "",
        createdAt: result.student.createdAt,
        updatedAt: result.student.updatedAt,
        lastAttendance: result.student.attendances[0]?.attendedAt ?? null,
      },
      date: result.attendedAt,
      type: {
        id: result.type.externalid,
        name: result.type.name,
        createdAt: result.type.createdAt,
        updatedAt: result.type.updatedAt,
      },
      demand: result.demand ?? "",
      generalObservations: result.observation ?? "",
      status: result.status,
      token: result.token ?? undefined,
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
        student: {
          include: {
            course: { include: { coordinator: true } },
            diagnoses: { include: { diagnosis: true } },
            attendances: { orderBy: { attendedAt: "desc" }, take: 1 },
          },
        },
        type: true,
      },
    });

    if (!attendance) return null;

    return {
      id: attendance.externalId,
      student: {
        id: attendance.student.externalId,
        name: attendance.student.name,
        enrollmentId: attendance.student.enrollmentId,
        dtBirth: attendance.student.dtBirth,
        email: attendance.student.email,
        phoneNumber: attendance.student.phoneNumber,
        course: {
          id: attendance.student.course.externalId,
          name: attendance.student.course.name,
          acronym: attendance.student.course.acronym,
          coordinatorId: attendance.student.course.coordinator?.externalId ?? "",
          coordinatorName: attendance.student.course.coordinator?.name ?? "",
          createdAt: attendance.student.course.createdAt,
          updatedAt: attendance.student.course.updatedAt,
        },
        diagnoses: attendance.student.diagnoses.map((d) => ({
          id: d.diagnosis.externalId,
          name: d.diagnosis.name,
          acronym: d.diagnosis.acronym ?? "",
          cid: d.diagnosis.CID ?? "",
          createdAt: d.diagnosis.createdAt,
          updatedAt: d.diagnosis.updatedAt,
        })),
        potential: attendance.student.potential ?? "",
        difficulties: attendance.student.difficulties ?? "",
        createdAt: attendance.student.createdAt,
        updatedAt: attendance.student.updatedAt,
        lastAttendance: attendance.student.attendances[0]?.attendedAt ?? null,
      },
      date: attendance.attendedAt,
      type: {
        id: attendance.type.externalid,
        name: attendance.type.name,
        createdAt: attendance.type.createdAt,
        updatedAt: attendance.type.updatedAt,
      },
      demand: attendance.demand ?? "",
      generalObservations: attendance.observation ?? "",
      status: attendance.status,
      token: attendance.token ?? undefined,
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
          student: {
            include: {
              course: { include: { coordinator: true } },
              diagnoses: { include: { diagnosis: true } },
              attendances: { orderBy: { attendedAt: "desc" }, take: 1 },
            },
          },
          type: true,
        },
      }),
    ]);

    const items: AttendanceResult[] = results.map((result) => ({
      id: result.externalId,
      student: {
        id: result.student.externalId,
        name: result.student.name,
        enrollmentId: result.student.enrollmentId,
        dtBirth: result.student.dtBirth,
        email: result.student.email,
        phoneNumber: result.student.phoneNumber,
        course: {
          id: result.student.course.externalId,
          name: result.student.course.name,
          acronym: result.student.course.acronym,
          coordinatorId: result.student.course.coordinator?.externalId ?? "",
          coordinatorName: result.student.course.coordinator?.name ?? "",
          createdAt: result.student.course.createdAt,
          updatedAt: result.student.course.updatedAt,
        },
        diagnoses: result.student.diagnoses.map((d) => ({
          id: d.diagnosis.externalId,
          name: d.diagnosis.name,
          acronym: d.diagnosis.acronym ?? "",
          cid: d.diagnosis.CID ?? "",
          createdAt: d.diagnosis.createdAt,
          updatedAt: d.diagnosis.updatedAt,
        })),
        potential: result.student.potential ?? "",
        difficulties: result.student.difficulties ?? "",
        createdAt: result.student.createdAt,
        updatedAt: result.student.updatedAt,
        lastAttendance: result.student.attendances[0]?.attendedAt ?? null,
      },
      date: result.attendedAt,
      type: {
        id: result.type.externalid,
        name: result.type.name,
        createdAt: result.type.createdAt,
        updatedAt: result.type.updatedAt,
      },
      demand: result.demand ?? "",
      generalObservations: result.observation ?? "",
      status: result.status,
      token: result.token ?? undefined,
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

  async existsTypeByUUID(uuid: string): Promise<boolean> {
    const type = await this.prisma.attendanceType.findUnique({
      where: { externalid: uuid },
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
