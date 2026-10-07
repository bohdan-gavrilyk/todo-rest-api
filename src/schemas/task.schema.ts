import { z } from "zod";
import { priorities } from "../types/Task";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  priority: z.enum(priorities),
});

export type CreateTask = z.infer<typeof createTaskSchema>;