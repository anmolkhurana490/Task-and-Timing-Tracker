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

export const suggestionQuerySchema = z.object({
  user_input: z.string().trim().min(10).max(1000)
})

export const TaskSuggestionSchema = z.array(
  z.object({
    title: z.string().max(100),
    description: z.string().max(300),
  })
);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type SuggestionQueryInput = z.infer<typeof suggestionQuerySchema>;
export type TaskSuggestionResponse = z.infer<typeof TaskSuggestionSchema>;