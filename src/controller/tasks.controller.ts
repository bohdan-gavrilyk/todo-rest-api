import type { Request, Response } from "express";

import { 
  getTasks, 
  getTaskById as getTaskByIdService, 
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService
} from "../services/tasks.service";

export async function getTasksWithFiltering(req: Request, res: Response) {
  const tasks = await getTasks(req.validatedQuery!);
  
  return res.status(200).json({ tasks });
}

export async function getTaskById(req: Request, res: Response) {
  const task = await getTaskByIdService(Number(req.params.id));

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  return res.status(200).json({
    task,
  });
}

export async function createTask(req: Request, res: Response) {
  const task = await createTaskService(req.body);

  return res.status(201).json({
    task,
  });
}

export async function updateTask(req: Request, res: Response) {
  const updatedTask = await updateTaskService(
    Number(req.params.id),
    req.body
  );

  if (!updatedTask) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  return res.status(200).json({
    task: updatedTask,
  });
}

export async function deleteTask(req:Request, res:Response) {
  const deletedTask = await deleteTaskService(Number(req.params.id));

  if (!deletedTask) {
    return res.status(404).json({
      error: "Task not found",
    });
  };

  return res.status(200).json({
    task: deletedTask,
  });
}