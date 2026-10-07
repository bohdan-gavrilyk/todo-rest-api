import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { z } from "zod";
import type { TasksQuery } from "../schemas/tasksQuery.schema";

type Target = "body" | "params" | "query";

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  target: Target = "body",
  errorMessage?: string
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        error: errorMessage ?? `Invalid request ${target}`,
        details: result.error.issues,
      });
    }

    if (target === "query") {
      req.validatedQuery = result.data as TasksQuery;
    } else {
      req[target] = result.data;
    }

    next();
  };
}