import { z } from "zod";

export const taskIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});