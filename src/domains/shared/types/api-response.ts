export interface PaginationMeta {
  total_items: number
  current_page: number
  last_page: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}
