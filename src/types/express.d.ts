import type { TasksQuery } from "../schemas/tasksQuery.schema";

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: TasksQuery;
    }
  }
}

export {};