export function validatePageLimitValues(page: number, limit: number) {
  if (page < 1) {
    throw new Error("Page must be greater than 0!");
  }
  if (limit < 1) {
    throw new Error("Page Limit must be greater than 0!");
  }
}
