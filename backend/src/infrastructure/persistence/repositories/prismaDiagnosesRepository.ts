import { Diagnosis } from "@domain/entities/diagnosis";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { DiagnosisListParams } from "@domain/repositories/filters/diagnosisFilters";
import { DiagnosisResult, PaginatedDiagnosisResult } from "@domain/repositories/results/diagnosisResult";
import {
  PrismaClient,
  Diagnosis as PrismaDiagnosis,
  Prisma,
} from "@prisma/src/infrastructure/database/generated/client";

export class PrismaDiagnosesRepository implements IDiagnosesRepository {
  constructor(private prisma: PrismaClient) {}

  async save(diagnosis: Diagnosis): Promise<void> {
    await this.prisma.diagnosis.create({
      data: {
        externalId: diagnosis.diagnosisId.value,
        name: diagnosis.name.value,
        CID: diagnosis.cid?.value ?? "",
        acronym: diagnosis.acronym?.value ?? "",
      },
    });
  }

  private mapToDiagnosisResult(diagnosis: PrismaDiagnosis): DiagnosisResult {
    return {
      id: diagnosis.externalId,
      name: diagnosis.name,
      acronym: diagnosis.acronym ?? "",
      cid: diagnosis.CID ?? "",
      createdAt: diagnosis.createdAt,
      updatedAt: diagnosis.updatedAt,
    };
  }

  async findById(id: string): Promise<DiagnosisResult | null> {
    const diagnosis = await this.prisma.diagnosis.findFirst({
      where: { externalId: id },
    });

    if (!diagnosis) return null;

    const diagnosisResult = this.mapToDiagnosisResult(diagnosis);

    return diagnosisResult;
  }

  async findAll(params: DiagnosisListParams): Promise<PaginatedDiagnosisResult> {
    const { page, limit, filters } = params;

    const where: Prisma.DiagnosisWhereInput = {
      removed: false,
      ...(filters.name && { name: { contains: filters.name, mode: "insensitive" } }),
      ...(filters.acronym && { acronym: { contains: filters.acronym, mode: "insensitive" } }),
      ...(filters.cid && { CID: { contains: filters.cid, mode: "insensitive" } }),
    };

    const [totalItems, diagnoses] = await Promise.all([
      this.prisma.diagnosis.count({ where }),
      this.prisma.diagnosis.findMany({
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
      items: diagnoses.map((d) => this.mapToDiagnosisResult(d)),
    };
  }

  async update(diagnosis: Diagnosis): Promise<void> {
    await this.prisma.diagnosis.update({
      where: { externalId: diagnosis.diagnosisId.value },
      data: {
        name: diagnosis.name.value,
        acronym: diagnosis.acronym?.value ?? null,
        CID: diagnosis.cid?.value ?? null,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.diagnosis.update({
      where: { externalId: id },
      data: { removed: true },
    });
  }

  async findByName(name: string): Promise<DiagnosisResult | null> {
    const diagnosis = await this.prisma.diagnosis.findFirst({
      where: { name, removed: false },
    });

    if (!diagnosis) return null;

    const diagnosisResult = this.mapToDiagnosisResult(diagnosis);

    return diagnosisResult;
  }

  async findByAcronym(acronym: string): Promise<DiagnosisResult | null> {
    const diagnosis = await this.prisma.diagnosis.findFirst({
      where: { acronym: acronym, removed: false },
    });

    if (!diagnosis) return null;

    const diagnosisResult = this.mapToDiagnosisResult(diagnosis);

    return diagnosisResult;
  }

  async findByCid(cid: string): Promise<DiagnosisResult | null> {
    const diagnosis = await this.prisma.diagnosis.findFirst({
      where: { CID: cid, removed: false },
    });

    if (!diagnosis) return null;

    const diagnosisResult = this.mapToDiagnosisResult(diagnosis);

    return diagnosisResult;
  }
}
