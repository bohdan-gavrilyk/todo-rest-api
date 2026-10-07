import { z } from "zod";
import { createTaskSchema } from "./task.schema";

export const updateTaskSchema = createTaskSchema
  .extend({
    completed: z.boolean(),
  })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "No fields to update",
    }
  );
export type UpdateTask = z.infer<typeof updateTaskSchema>;