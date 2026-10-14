export const EPISODE_NUM_PER_PAGE = 5
export const PAGINATOR_WINDOW_SIZE = 5

export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const start = 1 + Math.floor((currentPage - 1) / PAGINATOR_WINDOW_SIZE) * PAGINATOR_WINDOW_SIZE
  const end = Math.min(start + PAGINATOR_WINDOW_SIZE - 1, totalPages)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
