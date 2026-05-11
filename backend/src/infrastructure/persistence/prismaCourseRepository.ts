import { Prisma, PrismaClient } from "../../../prisma/src/infrastructure/database/generated/client";
import { Course } from "../../domain/entities/course";
import { ICourseRepository } from "../../domain/repositories/courseRepository";
import { ProfessorId } from "../../domain/valueObjects/professor/professorId";

export class PrismaCourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async save(course: Course): Promise<void> {
    let coordinatorId: number | undefined;

    if (course.coordenatorId) {
      const professor = await this.prisma.professor.findFirst({
        where: {
          externalId: course.coordenatorId.value,
          removed: false,
        },
        select: {
          internalId: true,
        },
      });

      if (!professor) {
        throw new Error("Professor not find");
      }

      coordinatorId = professor.internalId;
    }

    await this.prisma.course.create({
      data: {
        externalId: course.externalId.value,
        name: course.name.value,
        acronym: course.acronym.value,
        ...(coordinatorId !== undefined && { coordinatorId }),
      },
    });
  }
  async update(course: Course): Promise<void> {
    let coordinatorId: number | null = null;

    if (course.coordenatorId) {
      const professor = await this.prisma.professor.findFirst({
        where: {
          externalId: course.coordenatorId.value,
          removed: false,
        },
        select: {
          internalId: true,
        },
      });
      if (!professor) {
        throw new Error("Professor not find");
      }

      coordinatorId = professor.internalId;
    }

    await this.prisma.course.update({
      where: {
        externalId: course.externalId.value,
      },
      data: {
        name: course.name.value,
        acronym: course.acronym.value,
        ...(coordinatorId !== undefined && { coordinatorId }),
      },
    });
  }
}
