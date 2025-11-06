/**
 * @component TaskForm
 * @summary Form for creating and editing tasks
 * @domain task
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TaskFormProps, TaskFormData } from './types';
import type { CreateTaskDto } from '../../types';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['0', '1', '2']).optional(),
  category: z.string().optional(),
  estimatedTime: z.string().optional(),
  tags: z.string().optional(),
});

export const TaskForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      dueDate: defaultValues?.dueDate || '',
      priority: defaultValues?.priority?.toString() || '1',
      category: defaultValues?.category || '',
      estimatedTime: defaultValues?.estimatedTime?.toString() || '',
      tags: defaultValues?.tags?.join(', ') || '',
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const taskData: CreateTaskDto = {
      idAccount: 1,
      idUser: 1,
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
      priority: data.priority ? (parseInt(data.priority) as 0 | 1 | 2) : undefined,
      category: data.category || undefined,
      estimatedTime: data.estimatedTime ? parseInt(data.estimatedTime) : undefined,
      tags: data.tags
        ? data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    };

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Digite o título da tarefa"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Descreva os detalhes da tarefa"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Data de Vencimento
          </label>
          <input
            {...register('dueDate')}
            type="date"
            id="dueDate"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Prioridade
          </label>
          <select
            {...register('priority')}
            id="priority"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="0">Baixa</option>
            <option value="1">Média</option>
            <option value="2">Alta</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <input
            {...register('category')}
            type="text"
            id="category"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ex: Trabalho, Pessoal"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">
            Tempo Estimado (minutos)
          </label>
          <input
            {...register('estimatedTime')}
            type="number"
            id="estimatedTime"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ex: 60"
          />
          {errors.estimatedTime && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (separadas por vírgula)
        </label>
        <input
          {...register('tags')}
          type="text"
          id="tags"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Ex: urgente, importante"
        />
        {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>}
        <p className="mt-1 text-sm text-gray-500">
          Máximo de 5 tags, cada uma com até 20 caracteres
        </p>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-300 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};
