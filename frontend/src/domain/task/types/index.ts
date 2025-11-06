/**
 * @types Task
 * @summary Type definitions for task domain
 * @domain task
 * @category types
 */

export interface Task {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 0 | 1 | 2;
  category?: string;
  estimatedTime?: number;
  recurrenceConfig?: RecurrenceConfig;
  tags?: string[];
  status: 0 | 1 | 2;
  responsibles?: number[];
  reminders?: Reminder[];
  createdAt: string;
  createdBy: number;
}

export interface RecurrenceConfig {
  type: 'diária' | 'semanal' | 'mensal' | 'anual';
  frequency: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  lastDay?: boolean;
  endDate?: string;
  occurrences?: number;
}

export interface Reminder {
  dateTime: string;
  type: 'email' | 'notificacao' | 'sms';
  minutesBefore?: number;
}

export interface CreateTaskDto {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 0 | 1 | 2;
  category?: string;
  estimatedTime?: number;
  recurrenceConfig?: RecurrenceConfig;
  tags?: string[];
  responsibles?: number[];
  reminders?: Reminder[];
}

export interface TaskListParams {
  idAccount: number;
  idUser?: number;
  status?: 0 | 1 | 2;
  priority?: 0 | 1 | 2;
  category?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskGetParams {
  idAccount: number;
  idTask: number;
}

export const PRIORITY_LABELS = {
  0: 'Baixa',
  1: 'Média',
  2: 'Alta',
} as const;

export const STATUS_LABELS = {
  0: 'A fazer',
  1: 'Em andamento',
  2: 'Concluída',
} as const;
