/**
 * @summary
 * Task management API controller
 *
 * @module api/v1/internal/task
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/responseHelpers';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { taskCreate, taskList, taskGet } from '@/services/task';
import { taskCreateSchema, taskListSchema, taskGetSchema } from '@/services/task/taskValidation';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with specified properties
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} idUser User identifier
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} [dueDate] Due date (YYYY-MM-DD format)
 * @apiParam {Number} [priority] Priority (0=Baixa, 1=Média, 2=Alta)
 * @apiParam {String} [category] Task category
 * @apiParam {Number} [estimatedTime] Estimated time in minutes
 * @apiParam {Object} [recurrenceConfig] Recurrence configuration
 * @apiParam {Array} [tags] Array of tags (max 5, each max 20 chars)
 * @apiParam {Array} [responsibles] Array of responsible user IDs (max 5)
 * @apiParam {Array} [reminders] Array of reminder configurations (max 3)
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = taskCreateSchema.parse(req.body);

    const result = await taskCreate(validated);

    res.status(HTTP_STATUS.CREATED).json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists tasks with optional filtering
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} [idUser] Filter by user
 * @apiParam {Number} [status] Filter by status
 * @apiParam {Number} [priority] Filter by priority
 * @apiParam {String} [category] Filter by category
 * @apiParam {String} [dueDateFrom] Filter by due date from
 * @apiParam {String} [dueDateTo] Filter by due date to
 *
 * @apiSuccess {Array} tasks Array of task objects
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = taskListSchema.parse(req.query);

    const result = await taskList(validated);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /api/v1/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves complete task details
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Object} task Task details with related data
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = taskGetSchema.parse({
      idAccount: parseInt(req.query.idAccount as string),
      idTask: parseInt(req.params.id),
    });

    const result = await taskGet(validated);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'taskDoesntExist') {
      res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(error.message, 'NOT_FOUND'));
    } else {
      next(error);
    }
  }
}
