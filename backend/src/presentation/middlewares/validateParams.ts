import { NextFunction, Request, Response } from "express";

interface DTOClassWithCreate {
  create(idOrData: unknown, data?: unknown): unknown;
}

export function validateParams(DTOClass: DTOClassWithCreate) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.method === "GET" ? req.query : req.body;

      if (id) {
        req.dto = DTOClass.create(id, data);
      } else {
        req.dto = DTOClass.create(data);
      }
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
