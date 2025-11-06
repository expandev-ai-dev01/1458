/**
 * @summary
 * Task business logic implementation
 *
 * @module services/task/taskLogic
 */

import { TaskCreateRequest, TaskListRequest, TaskGetRequest, TaskDetail } from './taskTypes';

/**
 * @remarks In-memory task storage (no database persistence)
 */
const tasks: Map<number, TaskDetail> = new Map();
let nextTaskId = 1;

/**
 * @summary
 * Creates a new task in memory
 *
 * @function taskCreate
 * @module services/task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 *
 * @returns {Promise<{ idTask: number }>} Created task identifier
 *
 * @throws {Error} When validation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<{ idTask: number }> {
  /**
   * @validation Title validation
   */
  if (!params.title || params.title.trim().length < 3) {
    throw new Error('titleTooShort');
  }

  if (params.title.length > 100) {
    throw new Error('titleTooLong');
  }

  /**
   * @validation Priority validation
   */
  if (params.priority !== undefined && (params.priority < 0 || params.priority > 2)) {
    throw new Error('invalidPriority');
  }

  /**
   * @validation Due date validation
   */
  if (params.dueDate) {
    const dueDate = new Date(params.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      throw new Error('dueDateInPast');
    }
  }

  /**
   * @validation Tags validation
   */
  if (params.tags && params.tags.length > 5) {
    throw new Error('tooManyTags');
  }

  if (params.tags) {
    for (const tag of params.tags) {
      if (tag.length > 20) {
        throw new Error('tagTooLong');
      }
    }
  }

  /**
   * @validation Responsibles validation
   */
  if (params.responsibles && params.responsibles.length > 5) {
    throw new Error('tooManyResponsibles');
  }

  /**
   * @validation Reminders validation
   */
  if (params.reminders && params.reminders.length > 3) {
    throw new Error('tooManyReminders');
  }

  /**
   * @rule {fn-task-creation} Create task in memory
   */
  const idTask = nextTaskId++;
  const now = new Date();

  const task: TaskDetail = {
    idTask,
    idAccount: params.idAccount,
    idUser: params.idUser,
    title: params.title.trim(),
    description: params.description || '',
    dueDate: params.dueDate || null,
    priority: params.priority ?? 1,
    category: params.category || 'Sem categoria',
    status: 0,
    estimatedTime: params.estimatedTime || null,
    recurrenceConfig: params.recurrenceConfig || null,
    dateCreated: now,
    dateModified: now,
    tags: params.tags || [],
    attachments: [],
    responsibles: params.responsibles || [],
    reminders: params.reminders || [],
    subtasks: [],
  };

  tasks.set(idTask, task);

  return { idTask };
}

/**
 * @summary
 * Lists tasks with optional filtering
 *
 * @function taskList
 * @module services/task
 *
 * @param {TaskListRequest} params - List parameters
 *
 * @returns {Promise<Array>} Array of tasks
 */
export async function taskList(params: TaskListRequest): Promise<any[]> {
  const result: any[] = [];

  for (const task of tasks.values()) {
    /**
     * @rule {fn-multi-tenancy} Filter by account
     */
    if (task.idAccount !== params.idAccount) {
      continue;
    }

    /**
     * @rule {fn-task-filtering} Apply filters
     */
    if (params.idUser !== undefined && task.idUser !== params.idUser) {
      continue;
    }

    if (params.status !== undefined && task.status !== params.status) {
      continue;
    }

    if (params.priority !== undefined && task.priority !== params.priority) {
      continue;
    }

    if (params.category && task.category !== params.category) {
      continue;
    }

    if (params.dueDateFrom) {
      const dueDateFrom = new Date(params.dueDateFrom);
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
      if (!taskDueDate || taskDueDate < dueDateFrom) {
        continue;
      }
    }

    if (params.dueDateTo) {
      const dueDateTo = new Date(params.dueDateTo);
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
      if (!taskDueDate || taskDueDate > dueDateTo) {
        continue;
      }
    }

    result.push({
      idTask: task.idTask,
      idUser: task.idUser,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      status: task.status,
      estimatedTime: task.estimatedTime,
      dateCreated: task.dateCreated,
      tagCount: task.tags.length,
      attachmentCount: task.attachments.length,
      responsibleCount: task.responsibles.length,
      subtaskCount: task.subtasks.length,
      completedSubtaskCount: task.subtasks.filter((s) => s.status === 2).length,
    });
  }

  /**
   * @rule {fn-task-sorting} Sort by due date, priority, and creation date
   */
  result.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dateCompare !== 0) return dateCompare;
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }

    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
  });

  return result;
}

/**
 * @summary
 * Retrieves complete task details
 *
 * @function taskGet
 * @module services/task
 *
 * @param {TaskGetRequest} params - Get parameters
 *
 * @returns {Promise<TaskDetail>} Task details
 *
 * @throws {Error} When task not found
 */
export async function taskGet(params: TaskGetRequest): Promise<TaskDetail> {
  const task = tasks.get(params.idTask);

  /**
   * @validation Task existence and account validation
   */
  if (!task || task.idAccount !== params.idAccount) {
    throw new Error('taskDoesntExist');
  }

  return task;
}
