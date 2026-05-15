import { AttendanceType } from "@domain/entities/attendanceType";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { ListAttendanceTypeParams } from "@domain/repositories/filters/attendanceTypeFilters";
import {
  AttendanceTypeResult,
  PaginatedAttendanceTypeResult,
} from "@domain/repositories/results/attendanceTypeResult";
import {
  PrismaClient,
  AttendanceType as PrismaAttendanceType,
  Prisma,
} from "@prisma/src/infrastructure/database/generated/client";

export class PrismaAttendanceTypeRepository implements IAttendanceTypeRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToResult(record: PrismaAttendanceType): AttendanceTypeResult {
    return {
      id: record.externalid,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async save(entity: AttendanceType): Promise<void> {
    await this.prisma.attendanceType.create({
      data: {
        externalid: entity.externalId.value,
        name: entity.name.value,
      },
    });
  }

  async findById(id: string): Promise<AttendanceTypeResult | null> {
    const record = await this.prisma.attendanceType.findFirst({
      where: { externalid: id, removed: false },
    });

    if (!record) return null;

    return this.mapToResult(record);
  }

  async findByName(name: string): Promise<AttendanceTypeResult | null> {
    const record = await this.prisma.attendanceType.findFirst({
      where: { name, removed: false },
    });

    if (!record) return null;

    return this.mapToResult(record);
  }

  async findAll(params: ListAttendanceTypeParams): Promise<PaginatedAttendanceTypeResult> {
    const { page, limit, filters } = params;

    const where: Prisma.AttendanceTypeWhereInput = {
      removed: false,
      ...(filters.name && { name: { contains: filters.name, mode: "insensitive" } }),
    };

    const [totalItems, records] = await Promise.all([
      this.prisma.attendanceType.count({ where }),
      this.prisma.attendanceType.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items: records.map((r) => this.mapToResult(r)),
    };
  }

  async update(entity: AttendanceType): Promise<void> {
    await this.prisma.attendanceType.update({
      where: { externalid: entity.externalId.value },
      data: {
        name: entity.name.value,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.attendanceType.update({
      where: { externalid: id },
      data: { removed: true },
    });
  }
}
