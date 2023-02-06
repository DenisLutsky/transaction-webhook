export interface PaginatedResult<T> {
  rows: T[];
  count: number;
}
