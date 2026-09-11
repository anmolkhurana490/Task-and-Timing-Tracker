import { z } from "zod";
import { TaskStatus } from "../../../generated/prisma/enums";

/** Validates fields accepted when creating a task. */
export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
});

/** Validates fields accepted when updating a task. */
export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(TaskStatus).optional(),
});

/** Validates a task id route parameter. */
export const taskIdSchema = z.object({ id: z.cuid2() });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
