import {
  Prisma,
  PrismaClient,
} from "../../../prisma/src/infrastructure/database/generated/client.js";
import { Student } from "../../domain/entities/student.js";
import {
  type IStudentRepository,
  type SaveStudentParams,
} from "../../application/use-cases/interfaces/IStudentRepository.js";
import { EmailAlreadyExistsError } from "../../application/use-cases/register-student.js";
import { StudentMapper } from "./StudentMapper.js";

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
    const raw = await this.prisma.student.findUnique({
      where: { externalId: externaID },
    });

    if (!raw) return null;

    return StudentMapper.toDomain(raw);
  }
  async existsByUUID(externalId: string): Promise<boolean> {
    const student = await this.prisma.student.findUnique({
      where: { externalId },
      select: { internalId: true },
    });

    return !!student;
  }
}
