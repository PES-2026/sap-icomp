export function findValueInEnum<T extends Record<string, string>>(
  enumObj: T,
  value: string,
): T[keyof T] {
  const found = Object.values(enumObj).find((v) => v === value);

  if (!found) {
    throw new Error(
      `Invalid value: ${value} for enum ${enumObj.constructor.name}. Valid values: ${Object.values(enumObj).join(", ")}`,
    );
  }

  return found as T[keyof T];
}
