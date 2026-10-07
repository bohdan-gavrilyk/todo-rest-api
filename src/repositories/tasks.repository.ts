import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

import type { CreateTask } from "../schemas/task.schema";
import type { TasksQuery } from "../schemas/tasksQuery.schema";
import type { UpdateTask } from "../schemas/updateTask.schema";
import type { Task } from "../types/Task";

function isRecordNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export async function  findAll(query: TasksQuery): Promise<Task[]> {
  return prisma.task.findMany({
    where: {
      completed: query.completed,
      priority: query.priority,
    },
    orderBy:
      query.sort === "id"
        ? { id: "asc" }
        : query.sort === "priority"
          ? { priority: "asc" }
          : undefined,
  });
}

export async function findById(id: number): Promise <Task | null> {
  return prisma.task.findUnique({
    where: {
      id,
    },
  });
}

export async function create(taskData: CreateTask): Promise<Task> {
  return prisma.task.create({
    data: {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority
    }
  })
}

export async function update(id: number, updates: UpdateTask): Promise<Task | null> {
   try {
    return await prisma.task.update({
      where: { id },
      data: updates,
    })
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        return null;
      }
  
      throw error;
    }
}

export async function remove(id: number): Promise<Task | null> {
  try {
    return await prisma.task.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}