import { prisma } from "../../lib/prisma.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.validation.js";

/** Returns a paginated task list with each task's time logs. */
export function findTasks(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  return Promise.all([
    prisma.task.findMany({
      where: { userId },
      include: { timeLogs: { orderBy: { startedAt: "desc" } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.task.count({ where: { userId } }),
  ]);
}

/** Returns one task only when it belongs to the user. */
export function findTask(id: string, userId: string) {
  return prisma.task.findFirst({ where: { id, userId }, include: { timeLogs: { orderBy: { startedAt: "desc" } } } });
}

/** Creates a task owned by the authenticated user. */
export function insertTask(userId: string, data: CreateTaskInput) {
  const taskData = {
    title: data.title,
    description: data.description || "",
    userId,
  };
  return prisma.task.create({ data: taskData });
}

/** Updates a task only when it belongs to the user. */
export function updateTask(id: string, userId: string, data: UpdateTaskInput) {
  const taskData = {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
  };
  return prisma.task.update({ where: { id, userId }, data: taskData });
}

/** Deletes a task only when it belongs to the user. */
export function removeTask(id: string, userId: string) {
  return prisma.task.delete({ where: { id, userId } });
}
