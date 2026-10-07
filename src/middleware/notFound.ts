import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { AppError } from "../types/AppError";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error: AppError = new Error(
    `Not found: ${req.originalUrl}`
  );

  error.status = 404;

  next(error);
}