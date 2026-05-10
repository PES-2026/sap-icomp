export function validateStringField(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required and must be a string. Please verify it!`);
  }
  return value as string;
}
export function validateOptionalStringField(value: unknown, fieldName: string): string | undefined {
  if (value === "" || value === undefined) {
    return undefined;
  } else if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string. Please verify it!`);
  }
  const trimmed = value.trim();

  if (trimmed === "") {
    return undefined;
  }

  return trimmed;
}

export function validateDateField(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required and must be a string. Please verify it!`);
  }

  const parsedDate = new Date(value);

  if (isNaN(parsedDate.getTime())) {
    throw new Error(`${fieldName} has an invalid date format: '${value}'. Please verify it!`);
  }

  return parsedDate;
}

export function validateNumberField(value: unknown, fieldName: string): number {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (!isNaN(parsed)) return parsed;
  }
  throw new Error(`${fieldName} is required and must a number. Please verify it!`);
}

export function validateOptionalNumberField(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "number") {
    if (isNaN(value)) {
      throw new Error(`${fieldName} must be a valid number.`);
    }
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return undefined;
    }

    const parsed = Number(trimmed);
    if (isNaN(parsed)) {
      throw new Error(`${fieldName} must be a valid number. Please verify it!`);
    }
    return parsed;
  }
  throw new Error(`${fieldName} must be a valid number. Please verify it!`);
}

export function validateBooleanField(value: unknown, fieldName: string): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  throw new Error(
    `${fieldName} is required and must be a boolean, or a string being 'true' or 'false'. Please verify it!`,
  );
}
