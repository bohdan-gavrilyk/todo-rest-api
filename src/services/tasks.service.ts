import { findAll, findById, create, update, remove } from "../repositories/tasks.repository";
import type { CreateTask } from "../schemas/task.schema";
import type { TasksQuery } from "../schemas/tasksQuery.schema";
import type { UpdateTask } from "../schemas/updateTask.schema";
import type { Task } from "../types/Task";

export async function getTasks(query: TasksQuery): Promise<Task[]> {
  return findAll(query);
}

export async function getTaskById(id: number): Promise<Task | null> {
  return await findById(id);
}
export async function createTask(taskData: CreateTask): Promise<Task> {
  return await create(taskData);
}

export async function updateTask(id: number, updates: UpdateTask): Promise<Task | null> {
  return await update(id, updates);
}

export async function deleteTask(id: number): Promise<Task | null>{
  return await remove(id);
}