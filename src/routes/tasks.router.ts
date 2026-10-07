import express from "express";
import { createTask, getTaskById, updateTask, deleteTask, getTasksWithFiltering } from "../controller/tasks.controller";
import { validate } from "../middleware/validate";

import { tasksQuerySchema } from "../schemas/tasksQuery.schema";
import { taskIdSchema } from "../schemas/taskId.schema";
import { createTaskSchema } from "../schemas/task.schema";
import { updateTaskSchema } from "../schemas/updateTask.schema";

const router = express.Router();

router.get('/', validate(tasksQuerySchema, 'query'), getTasksWithFiltering);
router.get('/:id', validate(taskIdSchema ,'params', 'Invalid task id'), getTaskById);
router.post('/',  validate(createTaskSchema), createTask);
router.patch(
  "/:id", 
  validate(taskIdSchema, "params", 'Invalid task id'),
  validate(updateTaskSchema), 
  updateTask
);
router.delete("/:id", validate(taskIdSchema, "params", 'Invalid task id'), deleteTask);

export default router;