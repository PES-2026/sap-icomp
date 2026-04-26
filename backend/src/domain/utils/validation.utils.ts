export function validateStringField(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      `${fieldName} is required and must be a string. Please verify it!`,
    );
  }
  return value as string;
}

export function validateDateField(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      `${fieldName} is required and must be a string. Please verify it!`,
    );
  }

  const parsedDate = new Date(value);

  if (isNaN(parsedDate.getTime())) {
    throw new Error(
      `${fieldName} has an invalid date format: '${value}'. Please verify it!`,
    );
  }

  return parsedDate;
}
