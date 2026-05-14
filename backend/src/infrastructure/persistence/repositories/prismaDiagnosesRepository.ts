import { Diagnosis } from "@domain/entities/diagnosis";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { DiagnosisResult } from "@domain/repositories/results/diagnosisResult";
import { PrismaClient, Diagnosis as PrismaDiagnosis } from "@prisma/src/infrastructure/database/generated/client";

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
