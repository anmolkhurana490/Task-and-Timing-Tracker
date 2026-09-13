import type { ZodType } from "zod";

export function validateFormData<T>(schema: ZodType<T>, data: T) {
  const validated = schema.safeParse(data);

  if (!validated.success) {
    const nextErrors: Partial<Record<keyof T, string>> = {};

    for (const issue of validated.error.issues) {
      const field = issue.path[0] as keyof T;
      if (!nextErrors[field]) nextErrors[field] = issue.message;
    }

    return { success: false, errors: nextErrors };
  }

  return { success: true, data: validated.data };
}