import { Response } from "express";

import { ApplicationError } from "@application/errors/applicationError";
import { DomainError } from "@domain/errors/domainError";
import { Result } from "@domain/shared/result";

import { HttpErrorMapper } from "../mappers/httpErrorMapper";

export abstract class BaseController {
  /**
   * 200 OK
   */
  public ok<T>(res: Response, dto?: T): void {
    if (dto) {
      res.status(200).json(dto);
    } else {
      res.sendStatus(200);
    }
  }

  /**
   * 201 Created
   */
  public created<T>(res: Response, dto?: T): void {
    if (dto) {
      res.status(201).json(dto);
    } else {
      res.sendStatus(201);
    }
  }

  /**
   * 400 Bad Request
   */
  public clientError(res: Response, message?: string): void {
    res.status(400).json({ message: message || "Bad request" });
  }

  /**
   * 404 Not Found
   */
  public notFound(res: Response, message?: string): void {
    res.status(404).json({ message: message || "Not found" });
  }

  /**
   * Generical error from application
   */
  public handleError(error: unknown, res: Response, context?: string): void {
    // Errors retrieveds on try/catch exceptions
    console.error(`[${context || "BaseController"}] Unhandled Exception:`, error);
    res.status(500).json({ message: "Internal server error" });
  }

  /**
   * Handles the Result object form the Use Cases.
   * Maps the fails from Application and Domain into HTTP statuses
   */
  public handleResult<T>(
    res: Response,
    result: Result<T, DomainError | ApplicationError>,
    successStatusCode: 200 | 201 = 200,
  ): void {
    if (result.isSuccess) {
      if (successStatusCode === 201) {
        this.created(res, result.getValue());
      } else {
        this.ok(res, result.getValue());
      }
      return;
    }

    const error = result.error;
    if (error instanceof DomainError || error instanceof ApplicationError) {
      const { statusCode, body } = HttpErrorMapper.toResponse(error);
      res.status(statusCode).json(body);
    } else {
      // When an use case returns a generical error that hasn't a HTTP Mapping
      console.error(`[BaseController:handleResult] Unmapped Result Error:`, error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  }
}
