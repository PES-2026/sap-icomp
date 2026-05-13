import { Diagnosis } from "@domain/entities/diagnosis";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaDiagnosesRepository implements IDiagnosesRepository {
  constructor(private prisma: PrismaClient) {}

  async save(diagnosis: Diagnosis): Promise<void> {
    await this.prisma.diagnosis.create({
      data: {
        externalId: diagnosis.diagnosisId.value,
        name: diagnosis.name.value,
        cid: diagnosis.cid?.value ?? "",
        acronym: diagnosis.acronym?.value ?? "",
      },
    });
  }
}
