import {
  ListAttendanceTypeDTO,
  ListAttendanceTypeResponse,
} from "@application/dtos/attendanceType/listAttendanceTypeDto";
import { ApplicationError } from "@application/errors/applicationError";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { Result } from "@domain/shared/result";

export class ListAttendanceTypes {
  constructor(private readonly repository: IAttendanceTypeRepository) {}

  async execute(
    dto: ListAttendanceTypeDTO,
  ): Promise<Result<ListAttendanceTypeResponse, ApplicationError | DomainError>> {
    const results = await this.repository.findAll({
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    });

    return Result.ok<ListAttendanceTypeResponse>(results);
  }
}
