/**
 * @service taskService
 * @summary Task management service for authenticated endpoints
 * @domain task
 * @type rest-service
 * @apiContext internal
 */

import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto, TaskListParams, TaskGetParams } from '../types';

export const taskService = {
  /**
   * @endpoint POST /api/v1/internal/task
   * @summary Creates new task
   */
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post('/task', data);
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task
   * @summary Fetches list of tasks with filters
   */
  async list(params: TaskListParams): Promise<Task[]> {
    const response = await authenticatedClient.get('/task', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task/:id
   * @summary Fetches single task by ID
   */
  async getById(params: TaskGetParams): Promise<Task> {
    const response = await authenticatedClient.get(`/task/${params.idTask}`, {
      params: { idAccount: params.idAccount },
    });
    return response.data.data;
  },
};
