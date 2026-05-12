import { NextFunction, Request, Response } from "express";

type DTOWithParamsConstructor<T> = {
  create(id: unknown, body: unknown): T;
};

export function validateParams<T>(DTOClass: DTOWithParamsConstructor<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.dto = DTOClass.create(req.params.id, req.body);
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
        message: "Invalid request params",
      });
    }
  };
}
