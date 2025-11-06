/**
 * @summary
 * Task service type definitions
 *
 * @module services/task/taskTypes
 */

/**
 * @interface TaskCreateRequest
 * @description Task creation request parameters
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: number;
  category?: string;
  estimatedTime?: number;
  recurrenceConfig?: string;
  tags?: string[];
  responsibles?: number[];
  reminders?: TaskReminder[];
}

/**
 * @interface TaskListRequest
 * @description Task list request parameters
 */
export interface TaskListRequest {
  idAccount: number;
  idUser?: number;
  status?: number;
  priority?: number;
  category?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

/**
 * @interface TaskGetRequest
 * @description Task get request parameters
 */
export interface TaskGetRequest {
  idAccount: number;
  idTask: number;
}

/**
 * @interface TaskReminder
 * @description Task reminder configuration
 */
export interface TaskReminder {
  reminderDateTime: string;
  reminderType: number;
  minutesBefore?: number;
}

/**
 * @interface TaskAttachment
 * @description Task attachment information
 */
export interface TaskAttachment {
  idTaskAttachment: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  dateCreated: Date;
}

/**
 * @interface Subtask
 * @description Subtask information
 */
export interface Subtask {
  idSubtask: number;
  title: string;
  description: string;
  status: number;
  dateCreated: Date;
}

/**
 * @interface TaskDetail
 * @description Complete task details
 */
export interface TaskDetail {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string;
  dueDate: string | null;
  priority: number;
  category: string;
  status: number;
  estimatedTime: number | null;
  recurrenceConfig: string | null;
  dateCreated: Date;
  dateModified: Date;
  tags: string[];
  attachments: TaskAttachment[];
  responsibles: number[];
  reminders: TaskReminder[];
  subtasks: Subtask[];
}
