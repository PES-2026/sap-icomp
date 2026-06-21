import { Report } from "@domain/entities/report";
import { ListReportItemDTO } from "@application/dtos/report/listReportDto";

export interface IReportRepository {
  save(report: Report): Promise<void>;
  update(report: Report): Promise<void>;
  findById(id: string): Promise<any | null>;
  findByIdWithDetails(id: string): Promise<any | null>;
  findByStudentId(studentId: string): Promise<ListReportItemDTO[]>;
}
