import "dotenv/config";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is missing. Application cannot start.`);
  }
  return value;
}

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_TOKEN_EXPIRES: getEnv("JWT_TOKEN_EXPIRES"),
  BACKEND_PORT: getEnv("BACKEND_PORT"),
  FRONTEND_HOST: getEnv("FRONTEND_HOST"),
  FRONTEND_PORT: getEnv("FRONTEND_PORT"),
  ENVIRONMENT: getEnv("ENVIRONMENT"),
};
