import { Prisma, PrismaClient } from "@prisma/client";
import { Student } from "../../domain/entities/student.js";
import {
  type IStudentRepository,
  type SaveStudentParams,
} from "../../application/use-cases/interfaces/IStudentRepository.js";
import { EmailAlreadyExistsError } from "../../application/use-cases/register-student.js";

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
      await this.prisma.student.create({
        data: {
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new EmailAlreadyExistsError();
      }
      throw error;
    }
  }

  async findByUUID(externaID: string): Promise<Student | null> {
    return await this.prisma.student.findUnique({
      where: { externalId: externaID },
    });
  }
  async existsByUUID(externalId: string): Promise<boolean> {
    const student = await this.prisma.student.findUnique({
      where: { externalId },
      select: { internalId: true },
    });

    return !!student;
  }
}
