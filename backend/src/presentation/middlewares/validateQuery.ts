import { NextFunction, Request, Response } from "express";

type DTOConstructor<T> = {
  create(value: unknown): T;
};

export function validateQuery<T>(DTOClass: DTOConstructor<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.dto = DTOClass.create(req.query);
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "ValidationError",
          message: error.message,
        });
      }
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid request query",
      });
    }
  };
}
