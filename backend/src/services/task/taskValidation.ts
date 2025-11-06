/**
 * @summary
 * Task validation schemas using Zod
 *
 * @module services/task/taskValidation
 */

import { z } from 'zod';

/**
 * @remarks Task reminder schema
 */
const taskReminderSchema = z.object({
  reminderDateTime: z.string().datetime(),
  reminderType: z.number().int().min(0).max(2),
  minutesBefore: z.number().int().positive().optional(),
});

/**
 * @remarks Task creation validation schema
 */
export const taskCreateSchema = z.object({
  idAccount: z.number().int().positive(),
  idUser: z.number().int().positive(),
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
  priority: z.number().int().min(0).max(2).optional(),
  category: z.string().max(100).optional(),
  estimatedTime: z.number().int().positive().optional(),
  recurrenceConfig: z.string().optional(),
  tags: z.array(z.string().max(20)).max(5).optional(),
  responsibles: z.array(z.number().int().positive()).max(5).optional(),
  reminders: z.array(taskReminderSchema).max(3).optional(),
});

/**
 * @remarks Task list validation schema
 */
export const taskListSchema = z.object({
  idAccount: z.coerce.number().int().positive(),
  idUser: z.coerce.number().int().positive().optional(),
  status: z.coerce.number().int().min(0).max(2).optional(),
  priority: z.coerce.number().int().min(0).max(2).optional(),
  category: z.string().max(100).optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
});

/**
 * @remarks Task get validation schema
 */
export const taskGetSchema = z.object({
  idAccount: z.number().int().positive(),
  idTask: z.number().int().positive(),
});
