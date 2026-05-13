import { Prisma, PrismaClient } from "../../../prisma/src/infrastructure/database/generated/client";
import {
  CourseItemResponse,
  ListCourseRequest,
  ListCourseResponse,
} from "../../application/dtos/course/listCourse.dto";
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
  async findAll(params: ListCourseRequest): Promise<ListCourseResponse> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};

    if (filters.nameOrAcronym) {
      where.OR = [
        { name: { contains: filters.nameOrAcronym, mode: "insensitive" } },
        { acronym: { contains: filters.nameOrAcronym, mode: "insensitive" } },
      ];
    }
    const [totalItems, results] = await Promise.all([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { name: "asc" },
        include: { coordinator: { select: { name: true, externalId: true } } },
      }),
    ]);
    const itens: CourseItemResponse[] = results.map((course) => ({
      externalId: course.externalId,
      name: course.name,
      acronym: course.acronym,
      coordinatorId: course.coordinator?.externalId ? course.coordinator.externalId : undefined,
      coordinatorName: course.coordinator?.name ? course.coordinator.name : undefined,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));
    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items: itens,
    };
  }
}
