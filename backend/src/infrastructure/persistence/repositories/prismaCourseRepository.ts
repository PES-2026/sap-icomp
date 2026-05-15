import { CourseVO } from "@domain/entities/course";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { ListCourseRequest } from "@domain/repositories/filters/courseFilters";
import { CourseItem, PaginatedCourseResult } from "@domain/repositories/results/courseResult";
import { Prisma, PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaCourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(course: CourseVO): Promise<void> {
    let coordinatorId: number | undefined;

    if (course.coordinatorId) {
      const professor = await this.prisma.professor.findFirst({
        where: {
          externalId: course.coordinatorId.value,
          removed: false,
        },
        select: {
          internalId: true,
        },
      });

      coordinatorId = professor?.internalId;
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

  async update(course: CourseVO): Promise<void> {
    let coordinatorId: number | null = null;

    if (course.coordinatorId) {
      const professor = await this.prisma.professor.findFirst({
        where: {
          externalId: course.coordinatorId.value,
          removed: false,
        },
        select: {
          internalId: true,
        },
      });

      coordinatorId = professor?.internalId ?? null;
    }

    await this.prisma.course.update({
      where: {
        externalId: course.externalId.value,
      },
      data: {
        name: course.name.value,
        acronym: course.acronym.value,
        coordinatorId,
      },
    });
  }

  async findAll(params: ListCourseRequest): Promise<PaginatedCourseResult> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      removed: false,
      ...(filters.name && {
        name: { contains: filters.name, mode: "insensitive" },
      }),
      ...(filters.acronym && {
        acronym: { contains: filters.acronym, mode: "insensitive" },
      }),
    };

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

    const items: CourseItem[] = results.map((course) => ({
      id: course.externalId,
      name: course.name,
      acronym: course.acronym,
      coordinatorId: course.coordinator?.externalId ?? "",
      coordinatorName: course.coordinator?.name ?? "",
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

  async findById(id: string): Promise<CourseItem | null> {
    const course = await this.prisma.course.findFirst({
      where: {
        externalId: id,
        removed: false,
      },
      include: { coordinator: { select: { name: true, externalId: true } } },
    });

    if (!course) return null;

    return {
      id: course.externalId,
      name: course.name,
      acronym: course.acronym,
      coordinatorId: course.coordinator?.externalId ?? "",
      coordinatorName: course.coordinator?.name ?? "",
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  async findByName(name: string): Promise<CourseItem | null> {
    const course = await this.prisma.course.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        removed: false,
      },
      include: { coordinator: { select: { name: true, externalId: true } } },
    });

    if (!course) return null;

    return {
      id: course.externalId,
      name: course.name,
      acronym: course.acronym,
      coordinatorId: course.coordinator?.externalId ?? "",
      coordinatorName: course.coordinator?.name ?? "",
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  async findByAcronym(acronym: string): Promise<CourseItem | null> {
    const course = await this.prisma.course.findFirst({
      where: {
        acronym: {
          equals: acronym,
          mode: "insensitive",
        },
        removed: false,
      },
      include: { coordinator: { select: { name: true, externalId: true } } },
    });

    if (!course) return null;

    return {
      id: course.externalId,
      name: course.name,
      acronym: course.acronym,
      coordinatorId: course.coordinator?.externalId ?? "",
      coordinatorName: course.coordinator?.name ?? "",
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.course.updateMany({
      where: { externalId: id },
      data: { removed: true },
    });
  }

  async existsProfessorById(id: string): Promise<boolean> {
    const professor = await this.prisma.professor.findFirst({
      where: {
        externalId: id,
        removed: false,
      },
      select: {
        internalId: true,
      },
    });

    return !!professor;
  }

  async existsByExternalId(id: string): Promise<boolean> {
    const course = await this.prisma.course.findFirst({
      where: { externalId: id, removed: false },
      select: { internalId: true },
    });
    return !!course;
  }
}
