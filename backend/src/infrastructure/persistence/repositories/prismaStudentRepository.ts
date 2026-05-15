import { Student } from "@domain/entities/student";
import { StudentListParams } from "@domain/repositories/filters/studentFilters";
import { PaginatedStudentResult, StudentResult } from "@domain/repositories/results/studentResult";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Prisma, PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsByEmail(email: string): Promise<boolean> {
    const row = await this.prisma.student.findUnique({
      where: { email },
      select: { internalId: true },
    });
    return !!row;
  }

  async existsByEnrollmentId(enrollmentId: string): Promise<boolean> {
    const row = await this.prisma.student.findUnique({
      where: { enrollmentId },
      select: { internalId: true },
    });
    return !!row;
  }

  async save(student: Student): Promise<void> {
    const externalId = student.studentId.value;

    const baseData = {
      enrollmentId: student.enrollmentId.value,
      name: student.name.value,
      dtBirth: student.dtBirth.value,
      email: student.email.value,
      phoneNumber: student.phoneNumber.value,
      course: { connect: { externalId: student.course.value } },
      potential: student.potential?.value ?? "",
      difficulties: student.difficulties?.value ?? "",
    };

    const diagnosesConnect = student.diagnoses.map((diag) => ({
      diagnosis: { connect: { externalId: diag.value } },
    }));

    await this.prisma.student.create({
      data: {
        ...baseData,
        externalId,
        diagnoses: {
          create: diagnosesConnect,
        },
      },
    });
  }

  async update(student: Student): Promise<void> {
    const externalId = student.studentId.value;

    const baseData = {
      enrollmentId: student.enrollmentId.value,
      name: student.name.value,
      dtBirth: student.dtBirth.value,
      email: student.email.value,
      phoneNumber: student.phoneNumber.value,
      course: { connect: { externalId: student.course.value } },
      potential: student.potential?.value ?? "",
      difficulties: student.difficulties?.value ?? "",
    };

    const diagnosesUpdate = {
      deleteMany: {},
      create: student.diagnoses.map((vo) => ({
        diagnosis: { connect: { externalId: vo.value } },
      })),
    };

    await this.prisma.student.update({
      where: { externalId },
      data: {
        ...baseData,
        diagnoses: diagnosesUpdate,
      },
    });
  }

  async findByUUID(externalId: string): Promise<StudentResult | null> {
    const raw = await this.prisma.student.findUnique({
      where: { externalId },
      include: {
        course: true,
        diagnoses: { include: { diagnosis: true } },
        attendances: { orderBy: { attendedAt: "desc" }, take: 1 },
      },
    });

    if (!raw) return null;

    return {
      id: raw.externalId,
      name: raw.name,
      enrollmentId: raw.enrollmentId,
      dtBirth: raw.dtBirth,
      email: raw.email,
      phoneNumber: raw.phoneNumber,
      course: raw.course.externalId,
      diagnoses: raw.diagnoses.map((d) => d.diagnosis.externalId),
      potential: raw.potential ?? "",
      difficulties: raw.difficulties ?? "",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      lastAttendance: raw.attendances[0]?.attendedAt ?? null,
    };
  }

  async existsByUUID(externalId: string): Promise<boolean> {
    const student = await this.prisma.student.findUnique({
      where: { externalId },
      select: { internalId: true },
    });

    return !!student;
  }

  async disableByUUID(externalId: string): Promise<boolean> {
    try {
      await this.prisma.student.update({
        where: { externalId },
        data: { removed: true },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }

  async findAll(params: StudentListParams): Promise<PaginatedStudentResult> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
      removed: false,
      ...(filters.name && {
        name: { contains: filters.name, mode: "insensitive" },
      }),
      ...(filters.enrollment && {
        enrollmentId: { contains: filters.enrollment, mode: "insensitive" },
      }),
      ...(filters.course && {
        course: {
          OR: [
            { name: { contains: filters.course, mode: "insensitive" } },
            { acronym: { contains: filters.course, mode: "insensitive" } },
          ],
        },
      }),
      ...(filters.diagnosis && {
        diagnoses: {
          some: {
            diagnosis: {
              name: { contains: filters.diagnosis, mode: "insensitive" },
            },
          },
        },
      }),
      ...(filters.lastAttendance && {
        attendances: {
          some: {
            attendedAt: {
              gte: filters.lastAttendance,
            },
          },
        },
      }),
    };

    const [totalItems, results] = await Promise.all([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          course: true,
          diagnoses: { include: { diagnosis: true } },
          attendances: { orderBy: { attendedAt: "desc" }, take: 1 },
        },
      }),
    ]);

    const items: StudentResult[] = results.map((record) => ({
      id: record.externalId,
      name: record.name,
      enrollmentId: record.enrollmentId,
      dtBirth: record.dtBirth,
      course: record.course.externalId,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      phoneNumber: record.phoneNumber,
      potential: record.potential ?? "",
      diagnoses: record.diagnoses.map((d) => d.diagnosis.externalId),
      difficulties: record.difficulties ?? "",
      lastAttendance: record.attendances[0]?.attendedAt ?? null,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }
}
