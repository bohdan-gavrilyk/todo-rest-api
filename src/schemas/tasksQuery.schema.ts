import { z } from "zod";
import { priorities } from "../types/Task";

export const tasksQuerySchema = z.object({
  completed: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  priority: z.enum(priorities).optional(),

  sort: z.enum(["id", "priority"]).optional(),
});

export type TasksQuery = z.infer<typeof tasksQuerySchema>;