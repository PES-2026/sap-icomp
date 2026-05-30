import { NextFunction, Request, Response } from "express";

interface DTOClassWithCreate {
  create(id: string, query: unknown): unknown;
}

export function validateParamsAndQuery(DTOClass: DTOClassWithCreate) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error("Id is required in params");
      }

      req.dto = DTOClass.create(id, req.query);
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
        message: "Invalid request params or query",
      });
    }
  };
}
