import { ListUsersDTO } from "@application/dtos/user/listUsersDto";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { UserItem } from "@domain/repositories/results/userResult";
import { PaginatedResult } from "@domain/shared/pagination";
import { Result } from "@domain/shared/result";

export class ListUsers {
  constructor(
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(dto: ListUsersDTO): Promise<Result<PaginatedResult<UserItem>>> {
    // To provide true global pagination across two tables without a base table,
    // we fetch matching records from both. For performance at small-medium scales,
    // we can merge and paginate in memory.

    // Fetch a large limit or use a dedicated method for all filtered users if needed.
    // For now, we'll fetch with a very large limit to ensure we get all matches for merging.
    const MAX_ITEMS = 10000;

    const [pedagoguesResult, professorsResult] = await Promise.all([
      this.pedagogueRepository.findAll(dto.filters, 1, MAX_ITEMS),
      this.professorRepository.findAll(dto.filters, 1, MAX_ITEMS),
    ]);

    const allUsers: UserItem[] = [...pedagoguesResult.items, ...professorsResult.items];

    // Sort by name as a default
    allUsers.sort((a, b) => a.name.localeCompare(b.name));

    const totalItems = allUsers.length;
    const totalPages = Math.ceil(totalItems / dto.limit);
    const startIndex = (dto.page - 1) * dto.limit;
    const paginatedItems = allUsers.slice(startIndex, startIndex + dto.limit);

    return Result.ok({
      totalItems,
      totalPages,
      currentPage: dto.page,
      items: paginatedItems,
    });
  }
}
