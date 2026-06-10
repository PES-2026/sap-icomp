import { NextFunction, Request, Response } from "express";

interface DTOClassWithCreate {
  create(id: string, body: unknown): unknown;
}

export function validateParamsAndBody(DTOClass: DTOClassWithCreate) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id?: string };

      if (!id) {
        throw new Error("Id is required in params");
      }

      req.dto = DTOClass.create(id, req.body);
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
        message: "Invalid request params or body",
      });
    }
  };
}
