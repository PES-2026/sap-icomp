export function parseExpirationToMs(expiration: string | number): number {
  if (typeof expiration === "number") {
    return expiration * 1000;
  }

  const match = expiration.match(/^(\d+)([smhd]?)$/i);
  if (!match) {
    return 24 * 60 * 60 * 1000; // Default 1d
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!.toLowerCase();

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      // If no unit, assume seconds (like jsonwebtoken)
      return value * 1000;
  }
}
