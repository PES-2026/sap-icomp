import {
  ListTypeAttendanceDTO,
  ListTypeAttendanceResponse,
} from "@application/dtos/typeAttendance/listTypeAttendanceDto";
import { ApplicationError } from "@application/errors/applicationError";
import { DomainError } from "@domain/errors/domainError";
import { ITypeAttendanceRepository } from "@domain/repositories/typeAttendanceRepository";
import { Result } from "@domain/shared/result";

export class ListTypeAttendances {
  constructor(private readonly repository: ITypeAttendanceRepository) {}

  async execute(
    dto: ListTypeAttendanceDTO,
  ): Promise<Result<ListTypeAttendanceResponse, ApplicationError | DomainError>> {
    const results = await this.repository.findAll({
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    });

    return Result.ok<ListTypeAttendanceResponse>(results);
  }
}
