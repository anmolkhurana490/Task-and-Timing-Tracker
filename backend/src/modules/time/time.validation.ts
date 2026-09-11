import { cuid2, z } from "zod";

/** Validates the task used to start a timer. */
export const startTimeSchema = z.object({ taskId: cuid2() });

/** Validates a time-log id route parameter. */
export const timeLogIdSchema = z.object({ id: cuid2() });

export type StartTimeInput = z.infer<typeof startTimeSchema>;
