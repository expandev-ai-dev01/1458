/**
 * @types TaskForm
 * @summary Type definitions for TaskForm component
 */

import type { CreateTaskDto } from '../../types';

export interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateTaskDto>;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  category?: string;
  estimatedTime?: string;
  tags?: string;
}
