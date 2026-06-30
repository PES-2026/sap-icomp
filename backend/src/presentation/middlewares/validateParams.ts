import { NextFunction, Request, Response } from "express";

interface DTOClassWithCreate {
  create(id: string, ...args: unknown[]): unknown;
}

export function validateParams(DTOClass: DTOClassWithCreate) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, args } = req.params;

      if (!id || typeof id !== "string") {
        throw new Error("Id is required in params and must be a string");
      }

      req.dto = DTOClass.create(id, args);
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
