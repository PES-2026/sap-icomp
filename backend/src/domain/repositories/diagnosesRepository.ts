import { Diagnosis } from "@domain/entities/diagnosis";

export interface IDiagnosesRepository {
  save(diagnosis: Diagnosis): Promise<void>;
}
