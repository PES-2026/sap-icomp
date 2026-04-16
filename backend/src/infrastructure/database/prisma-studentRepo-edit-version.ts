import type { IStudentRepository } from "../../domain/entities/studentRepositpry-EDIT-VERSION.js";
import type { StudentData } from "../../domain/entities/student-data.js";
import { Prisma, PrismaClient } from "@prisma/client/extension";
import { Student } from "../../domain/entities/student.js";
import type { SaveStudentParams } from "../../domain/entities/studentRepositpry-EDIT-VERSION.js";
import { EmailAlreadyExistsError } from "../../application/use-cases/edit-student.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

//UTILISE ONLY SAVE(), existsByUUID AND findByUUID

export class PrismaStudentRepositoy implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }
  // COM BASE NO DEVELOP --DEPOIS
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
}
