export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
}
