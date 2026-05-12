import { EmailAlreadyExistsError } from "@application/useCases/student/createStudent.js";
import { Student } from "@domain/entities/student.js";
import { type SaveStudentParams } from "@domain/repositories/studentRepository.js";
import { type IStudentRepository } from "@domain/repositories/studentRepository.js";
import { Prisma, PrismaClient } from "@prisma/src/infrastructure/database/generated/client.js";

import { studentMapper } from "./studentMapper.js";
import { ListStudentRequest, ListStudentResponse } from "@application/dtos/student/listStudentsDto.js";

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

  async save(params: SaveStudentParams): Promise<Student> {
    const { student } = params;

    try {
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

      return student;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }

  async findByUUID(externaID: string): Promise<Student | null> {
    const raw = await this.prisma.student.findUnique({
      where: { externalId: externaID },
    });

    if (!raw) return null;

    return studentMapper.toDomain(raw);
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

  async findAll(params: ListStudentRequest): Promise<ListStudentResponse> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
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

    const items: AttendanceItemResult[] = results.map((record) => ({
      id: record.externalId,
      studentId: record.student.externalId,
      studentName: record.student.name,
      enrollmentId: record.student.enrollmentId,
      course: record.student.course.name,
      attendanceType: record.type,
      attendanceDate: record.date,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }
}
