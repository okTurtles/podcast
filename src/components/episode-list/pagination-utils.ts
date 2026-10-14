export const PAGINATION_COUNT = 5
export const PAGINATOR_PAGE_SIZE = 5

export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const start = 1 + Math.floor((currentPage - 1) / PAGINATOR_PAGE_SIZE) * PAGINATOR_PAGE_SIZE
  const end = Math.min(start + PAGINATOR_PAGE_SIZE - 1, totalPages)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
