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
    await this.prisma.student.upsert({
      where: {
        externalId: student.studentId.value,
      },
      update: {
        enrollmentId: student.enrollmentId.value,
        name: student.name.value,
        dtBirth: student.dtBirth.value,
        email: student.email.value,
        phoneNumber: student.phoneNumber.value,
        courseId: student.course.value,
        diagnosis: student.diagnosis.value || null,
        potential: student.potential.value || null,
        difficulties: student.difficulties.value || null,
      },
      create: {
        externalId: student.studentId.value,
        enrollmentId: student.enrollmentId.value,
        name: student.name.value,
        dtBirth: student.dtBirth.value,
        email: student.email.value,
        phoneNumber: student.phoneNumber.value,
        courseId: student.course.value,
        diagnosis: student.diagnosis.value || null,
        potential: student.potential.value || null,
        difficulties: student.difficulties.value || null,
      },
    });
  }

  async findByUUID(externaID: string): Promise<StudentResult | null> {
    const raw = await this.prisma.student.findUnique({
      where: { externalId: externaID },
    });

    if (!raw) return null;

    return {
      id: raw.externalId,
      name: raw.name,
      enrollmentId: raw.enrollmentId,
      dtBirth: raw.dtBirth,
      email: raw.email,
      phoneNumber: raw.phoneNumber,
      course: raw.courseId,
      diagnosis: raw.diagnosis ?? "",
      potential: raw.potential ?? "",
      difficulties: raw.difficulties ?? "",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      lastAttendance: null,
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
        courseId: { contains: filters.course, mode: "insensitive" },
      }),
      ...(filters.diagnosis && {
        diagnosis: { contains: filters.diagnosis, mode: "insensitive" },
      }),
      ...(filters.lastAttendance && {
        attendances: {
          some: {
            date: {
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
        include: { attendances: true },
      }),
    ]);

    const items: StudentResult[] = results.map((record) => ({
      id: record.externalId,
      name: record.name,
      enrollmentId: record.enrollmentId,
      dtBirth: record.dtBirth,
      course: record.courseId,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      phoneNumber: record.phoneNumber,
      potential: record.potential ?? "",
      diagnosis: record.diagnosis ?? "",
      difficulties: record.difficulties ?? "",
      lastAttendance: record.attendances[0]?.date ?? null,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }
}
