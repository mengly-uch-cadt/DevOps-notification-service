import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { validate } from '../middlewares/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  taskGlobalIdParamSchema,
  paginationQuerySchema,
} from '../schemas/task.schema';

const router = Router();

// Private routes (for use with authentication)
export const privateTaskRoutes = Router();

privateTaskRoutes.post(
  '/',
  validate(createTaskSchema),
  taskController.createTask.bind(taskController)
);

privateTaskRoutes.put(
  '/:id',
  validate(updateTaskSchema),
  taskController.updateTask.bind(taskController)
);

privateTaskRoutes.get(
  '/id/:id',
  validate(taskIdParamSchema),
  taskController.getTaskById.bind(taskController)
);

privateTaskRoutes.get(
  '/:global_id',
  validate(taskGlobalIdParamSchema),
  taskController.getTaskByGlobalId.bind(taskController)
);

privateTaskRoutes.get(
  '/',
  validate(paginationQuerySchema),
  taskController.getAllTasks.bind(taskController)
);

// Public routes (no authentication)
export const publicTaskRoutes = Router();

publicTaskRoutes.get(
  '/:global_id',
  validate(taskGlobalIdParamSchema),
  taskController.getTaskByGlobalId.bind(taskController)
);

export default router;
