import { ITypeAttendanceRepository } from "../../../domain/repositories/typeAttendanceRepository";
import {
  ListTypeAttendanceDTO,
  ListTypeAttendanceRequest,
  ListTypeAttendanceResponse,
} from "../../dtos/typeAttendance/listTypeAttendance.dto";

export class ListTypeAttendance {
  constructor(private repository: ITypeAttendanceRepository) {}

  async execute(
    dto: ListTypeAttendanceDTO,
  ): Promise<ListTypeAttendanceResponse> {
    const params: ListTypeAttendanceRequest = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };
    return this.repository.findAll(params);
  }
}
