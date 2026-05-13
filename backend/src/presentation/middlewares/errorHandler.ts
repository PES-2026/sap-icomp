import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global middleware for error handling.
 * Must be the LAST middleware added to Express (after all routes).
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // The `next` parameter must be present in the signature for Express to recognize it as an Error Handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const isUnexpectedError = !err.statusCode || statusCode === 500;

  // Structured logging for better observability and debugging
  const errorLog = {
    timestamp: new Date().toISOString(),
    level: isUnexpectedError ? "error" : "warn",
    message: err.message,
    name: err.name || "Error",
    stack: isUnexpectedError ? err.stack : undefined,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
  };

  console.error(JSON.stringify(errorLog));

  // Fallback 500: Do not expose internal details to the client on unexpected errors
  const clientMessage = isUnexpectedError ? "Internal Server Error" : err.message;

  res.status(statusCode).json({
    error: isUnexpectedError ? "InternalServerError" : err.name || "Error",
    message: clientMessage,
  });
}
