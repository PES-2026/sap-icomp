export interface PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}

export type PaginationParams<K extends string, V> = {
  page: number;
  limit: number;
} & {
  [key in K]: V;
};
