import { ListReportItemDTO } from "@application/dtos/report/listReportDto";
import { Report } from "@domain/entities/report";

export interface IReportRepository {
  save(report: Report): Promise<void>;
  update(report: Report): Promise<void>;
  remove(id: string): Promise<void>;
  findById(id: string): Promise<any | null>;
  findByIdWithDetails(id: string): Promise<any | null>;
  findByStudentId(studentId: string): Promise<ListReportItemDTO[]>;
  findPedagoguePasswordByReportId(reportId: string): Promise<string | null>;
  existsById(id: string): Promise<boolean>;
}
