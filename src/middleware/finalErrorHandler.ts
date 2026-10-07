import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { AppError } from "../types/AppError";

export function finalErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;

  console.error(err);

  const message =
    status === 500
      ? "Internal Server Error"
      : err.message;

  return res.status(status).json({
    error: true,
    status,
    message,
  });
}